// src/routes/auth.ts
import express from 'express';
import {
  register,
  login,
  verifyEmail,
  searchUsers,
} from '../controllers/authController';
import {
  requestPasswordReset,  // Make sure this import matches exactly
  resetPassword,
} from '../controllers/passwordController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Correct route names to match your controller methods
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.get('/search', protect, searchUsers);

// In your routes file
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
export default router;