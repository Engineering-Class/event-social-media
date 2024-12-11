import { Request, Response } from 'express';
import Event, { IEvent } from '../models/Event';
import User from '../models/User';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export const createEvent = async (req: Request, res: Response) => {
  const { name, description, date, time } = req.body;

  try {
    let image = null;

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const outputPath = path.join('uploads', fileName);

      // Resize the image using Sharp
      await sharp(req.file.path)
        .resize(300, 200, { fit: 'cover' }) // Set dimensions (800x600 as an example)
        .toFormat('jpeg') // Convert to JPEG for consistency
        .jpeg({ quality: 80 }) // Adjust quality to 80%
        .toFile(outputPath);

      // Remove the original uploaded file to save storage
      fs.unlinkSync(req.file.path);

      image = `uploads/${fileName}`;
    }

    const newEvent = await Event.create({
      name,
      description,
      date,
      time,
      image, // Save resized image path
      createdBy: req.user?._id,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getEvents = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;
    const user = await User.findById(req.user?._id).populate('friends', '_id');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const friendIds = user.friends.map((friend: any) => friend._id);
    const userAndFriendIds = [req.user?._id, ...friendIds]; // Include the user and their friends

    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    const events = await Event.find({
      date: { $gte: startDate, $lte: endDate },
      createdBy: { $in: userAndFriendIds }, // Restrict events to user's circle
    }).populate('createdBy', 'username email');

    res.status(200).json({ events });
  } catch (error) {
    console.error('Get Events Error:', error);
    res.status(500).json({ message: 'Failed to fetch events.' });
  }
};

export const getEventFeed = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).populate('friends', '_id');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const friendIds = user.friends.map((friend: any) => friend._id);

    const events = await Event.find({
      createdBy: { $in: [req.user?._id, ...friendIds] },
    })
      .populate('createdBy', 'username email')
      .sort({ date: -1 });

    res.status(200).json({ events });
  } catch (error) {
    console.error('Get Event Feed Error:', error);
    res.status(500).json({ message: 'Failed to fetch events.' });
  }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is authorized to delete the event
    if (event.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this event' });
    }

    await event.deleteOne();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete Event Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
