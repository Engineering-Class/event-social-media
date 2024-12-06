// src/controllers/authController.ts
import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import logger from '../utils/logger'; // Assuming you have a logger

dotenv.config();

const generateToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Registration validation failed: %o', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      logger.warn('Registration failed: Username or email already exists');
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      username,
      email,
      password, // Plain password; will be hashed automatically
      emailVerificationToken,
    });

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}`;
    const message = `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Email Verification',
      html: message,
    });

    // Generate token
    const token = generateToken(user);

    logger.info('User registered successfully: %s', username);

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    logger.error('Registration Error: %o', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Login validation failed: %o', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body; // Ensure frontend sends 'username' and 'password'

  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn('Login failed: User "%s" not found.', username);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      logger.warn('Login failed: Email for user "%s" not verified.', username);
      return res.status(400).json({ message: 'Please verify your email before logging in.' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      logger.warn('Login failed: Incorrect password for user "%s".', username);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);
    logger.info('User "%s" logged in successfully.', username);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    logger.error('Login Error for user "%s": %o', req.body.username, error);
    res.status(500).json({ message: 'Server error' });
  }
};
// src/controllers/authController.ts
export const validateToken = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};


// @desc    Get logged-in user's profile
// @route   GET /api/auth/me
// @access  Protected
export const getUserProfile = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  logger.info('Fetched profile for user "%s".', user.username);

  res.status(200).json({ user });
};

// @desc    Verify user's email
// @route   GET /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    if (!token || typeof token !== 'string') {
      logger.warn('Email verification failed: Invalid or missing token.');
      return res.status(400).json({ message: 'Invalid or missing token' });
    }

    // Find user with the verification token
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      logger.warn('Email verification failed: Invalid token or user already verified.');
      return res.status(400).json({ message: 'Invalid token or user already verified' });
    }

    // Update user to verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    // Generate JWT token
    const jwtToken = generateToken(user);

    logger.info('User "%s" email verified successfully.', user.username);

    res.status(200).json({
      message: 'Email verified successfully',
      token: jwtToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error: any) {
    logger.error('Email Verification Error: %o', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search users
// @route   GET /api/auth/search?query=
// @access  Protected
export const searchUsers = async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Invalid search query.' });
  }

  try {
    const regex = new RegExp(query, 'i');
    const users = await User.find({
      $or: [
        { username: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    }).select('username email');

    res.status(200).json({ users });
  } catch (error) {
    console.error('Search Users Error:', error);
    res.status(500).json({ message: 'Failed to search users.' });
  }
};
