import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './src/routes/api.js';
import { globalLimiter } from './src/middleware/rateLimiter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security & utility middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://organcare-health-84c2b.web.app', 'https://organcare-health-84c2b.firebaseapp.com'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Apply rate limiting
app.use('/api', globalLimiter);

// API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'OrganCare Healthcare REST API Server',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('[Internal Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🩺 OrganCare Backend Server Running`);
  console.log(`🚀 Port: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Firebase Project: ${process.env.FIREBASE_PROJECT_ID || 'organcare-health-84c2b'}`);
  console.log(`=================================================\n`);
});
