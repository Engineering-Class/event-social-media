import express from 'express';
import { register, login, verifyEmail , getUserProfile, updateUser , validateToken, searchUsers } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware'; // Ensure `protect` is exported from `authMiddleware`
import {
  requestPasswordReset,  // Make sure this import matches exactly
  resetPassword,
} from '../controllers/passwordController';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/request-reset-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/me', getUserProfile);
router.get('/validate-token', validateToken);
router.get('/search', searchUsers);
router.put('/update-user', protect, updateUser); // Add the update-user route
// Protected Routes (example)
router.use(protect); // Apply middleware

export default router;
