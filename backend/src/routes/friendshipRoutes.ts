import express from 'express';
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest ,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from '../controllers/friendsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getFriends);
router.get('/requests', protect, getFriendRequests);
router.post('/accept', protect, acceptFriendRequest);
router.post('/decline', protect, declineFriendRequest);
router.delete('/remove/:id', protect, removeFriend);
router.post('/send-request', protect, sendFriendRequest);
router.post('/accept-request', protect, acceptFriendRequest);

export default router;
