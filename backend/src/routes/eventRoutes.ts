// src/routes/eventRoutes.ts
import express from 'express';
import { createEvent, getEvents, getEventFeed, deleteEvent } from '../controllers/eventController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create', protect, createEvent);
router.get('/', protect, getEvents);
router.get('/feed', protect, getEventFeed); // Add this route for the feed
router.delete('/:id', protect, deleteEvent);

export default router;
