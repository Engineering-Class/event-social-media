import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import sendEmail from '../utils/sendEmail';
import logger from '../utils/logger';

export const requestPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate a raw reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
  
      // Hash the token and set it in the database
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes
      await user.save();
  
      // Send email with the raw token
      const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
      const message = `
        <h1>Password Reset Request</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
      `;
      console.log('Raw Token:', resetToken);
      console.log('Hashed Token:', hashedToken);

  
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        html: message,
      });
  
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  export const resetPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;
  
    try {
      if (!token) {
        return res.status(400).json({ message: 'Invalid or missing token' });
      }
  
      // Hash the incoming token to match the hashed version in the database
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
      // Find the user with the hashed token
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      // Update the user's password
      user.password = password; // Password will be hashed by the pre-save hook
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save();
      console.log('Hashed Incoming Token:', hashedToken);
      console.log('Stored Token:', user.resetPasswordToken);
  
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  