import express from 'express';
import multer from 'multer';
import { createEvent, getEvents, getEventFeed, deleteEvent } from '../controllers/eventController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/create', protect, upload.single('image'), createEvent); 
router.get('/', protect, getEvents);
router.get('/feed', protect, getEventFeed);
router.delete('/:id', protect, deleteEvent);

export default router;
