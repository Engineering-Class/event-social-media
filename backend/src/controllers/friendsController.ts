import { Request, Response } from 'express';
import User from '../models/User';

// Get all friends
export const getFriends = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).populate('friends', 'username email');
    res.status(200).json({ friends: user?.friends || [] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch friends' });
  }
};

// Get friend requests
export const getFriendRequests = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).populate('friendRequests', 'username email');
    res.status(200).json({ requests: user?.friendRequests || [] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch friend requests' });
  }
};

export const sendFriendRequest = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const user = await User.findById(req.user?._id);
    const recipient = await User.findById(userId);

    if (!user || !recipient) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (recipient.friendRequests.includes(user._id)) {
      return res.status(400).json({ message: 'Friend request already sent.' });
    }

    if (recipient.friends.includes(user._id)) {
      return res.status(400).json({ message: 'You are already friends.' });
    }

    recipient.friendRequests.push(user._id);
    await recipient.save();

    res.status(200).json({ message: 'Friend request sent successfully.' });
  } catch (error) {
    console.error('Send Friend Request Error:', error);
    res.status(500).json({ message: 'Failed to send friend request.' });
  }
};

// Accept friend request
export const acceptFriendRequest = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(req.user?._id);
    const targetUser = await User.findById(userId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.friends.push(userId);
    targetUser.friends.push(req.user?._id);

    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== userId);
    await user.save();
    await targetUser.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept friend request' });
  }
};

// Decline friend request
export const declineFriendRequest = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== userId);
    await user.save();

    res.status(200).json({ message: 'Friend request declined' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to decline friend request' });
  }
};

// Remove a friend
export const removeFriend = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(req.user?._id);
    const targetUser = await User.findById(id);

    if (!user || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.friends = user.friends.filter((friendId) => friendId.toString() !== id);
    targetUser.friends = targetUser.friends.filter((friendId) => friendId.toString() !== req.user?._id);

    await user.save();
    await targetUser.save();

    res.status(200).json({ message: 'Friend removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove friend' });
  }
};

