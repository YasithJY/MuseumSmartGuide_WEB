import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import museumRoutes from './routes/museumRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import exhibitRoutes from './routes/exhibitRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allow loading of uploaded images by client
}));
app.use(cors());
app.use(express.json());

// Set up path resolution for static files upload serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/museums', museumRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/exhibits', exhibitRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/categories', categoryRoutes);

// Simple health check route
app.get('/', (req, res) => {
  res.send('Museum 150 Smart Guide API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format: "${err.value}"`;
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
