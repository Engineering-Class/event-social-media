import { Request, Response } from 'express';
import Event, { IEvent } from '../models/Event';
import User from '../models/User';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer'; // Import nodemailer

export const createEvent = async (req: Request, res: Response) => {
  const { name, description, date, time, invitedFriends } = req.body;

  try {
    // Handle image upload and resizing
    let image = null;
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const outputPath = path.join('uploads', fileName);

      await sharp(req.file.path)
        .resize(300, 200, { fit: 'cover' })
        .toFormat('jpeg')
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      fs.unlinkSync(req.file.path);

      image = `uploads/${fileName}`;
    }

    // Parse invited friends to ensure it's an array of ObjectIds
    const parsedInvitedFriends = invitedFriends ? JSON.parse(invitedFriends) : [];

    // Create the new event
    const newEvent = await Event.create({
      name,
      description,
      date,
      time,
      image,
      createdBy: req.user?._id,
      invitedFriends: parsedInvitedFriends,
    });

    // Fetch email addresses of invited friends
    if (parsedInvitedFriends.length > 0) {
      const friends = await User.find({ _id: { $in: parsedInvitedFriends } }).select('email username');

      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 465,
        secure: Number(process.env.EMAIL_PORT) === 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      for (const friend of friends) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: friend.email,
          subject: `You're Invited to an Event!`,
          html: `
            <p>Hello ${friend.username},</p>
            <p>You have been invited to the event: <strong>${name}</strong>.</p>
            <p>Description: ${description}</p>
            <p>Date: ${new Date(date).toLocaleString()} Time: ${time}</p>
            <p>Log in to your account to view more details!</p>
          `,
        });
      }
    }

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
      $or: [
        { createdBy: req.user?._id }, // Include user's own events
        { invitedFriends: { $in: [req.user?._id] } }, // Include events where the user is invited
      ],
      date: { $gte: startDate, $lte: endDate },
    }).populate('createdBy', 'username email').populate('invitedFriends', 'username email');

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
