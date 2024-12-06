import { Request, Response } from 'express';
import Event, { IEvent } from '../models/Event';
import User from '../models/User';
// Create a new event
export const createEvent = async (req: Request, res: Response) => {
  const { name, description, date } = req.body;

  try {
    const newEvent = await Event.create({
      name,
      description,
      date,
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
    const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
    const month = req.query.month ? Number(req.query.month) : new Date().getMonth() + 1;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const events = await Event.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate('createdBy', 'username email');

    res.status(200).json({ events });
  } catch (error) {
    console.error('Get Events Error:', error);
    res.status(500).json({ message: 'Failed to fetch events.' });
  }
};

export const getEventFeed = async (req: Request, res: Response) => {
    try {
      // Fetch user's friends
      const user = await User.findById(req.user?._id).populate('friends', '_id');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const friendIds = user.friends.map((friend: any) => friend._id); // Ensure `friends` is populated
  
      // Fetch events created by the user and their friends
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
