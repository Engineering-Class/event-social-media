// src/server.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes';
import logger from './utils/logger';
import eventRoutes from './routes/eventRoutes';
import friendsRoutes from './routes/friendshipRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes); // Ensure proper import/export in authRoutes
app.use('/api/friends', friendsRoutes);
// Global Error Handler (optional)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled Error: %o', err);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
  });
