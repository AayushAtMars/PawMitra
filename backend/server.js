// Load environment variables FIRST
import './config/env.js';

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Import configurations
import connectDB from './config/database.js';
import passportConfig from './config/passport.js';
import setupSocketIO from './sockets/index.js';

// Import services
import geminiService from './services/geminiService.js';
import cloudinaryService from './services/cloudinaryService.js';

// Import routes
import authRoutes from './routes/auth.js';
import incidentRoutes from './routes/incidents.js';
import volunteerRoutes from './routes/volunteers.js';
import petRoutes from './routes/pets.js';
import marketplaceRoutes from './routes/marketplace.js';

// Load environment variables
dotenv.config();
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN?.split(',') || ['http://localhost:8081', 'http://localhost:5173'],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Connect to MongoDB
connectDB();

// Initialize services
geminiService.initialize();
cloudinaryService.initialize();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: true, // Allow all origins for mobile devices
  credentials: true,
  exposedHeaders: ['Authorization'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Logging

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Initialize Passport
app.use(passportConfig.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PawMitra API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      incidents: '/api/incidents',
      volunteers: '/api/volunteers',
      pets: '/api/pets',
      marketplace: '/api/marketplace'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Setup Socket.IO
setupSocketIO(io);

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║           🐾 PawMitra Backend Server 🐾              ║
║                                                       ║
║  Server running on: http://localhost:${PORT}          ║
║  Environment: ${process.env.NODE_ENV || 'development'}                      ║
║                                                       ║
║  API Endpoints:                                       ║
║  • Auth:        /api/auth                            ║
║  • Incidents:   /api/incidents                       ║
║  • Volunteers:  /api/volunteers                      ║
║  • Pets:        /api/pets                            ║
║  • Marketplace: /api/marketplace                     ║
║                                                       ║
║  Socket.IO: Connected ✅                              ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  httpServer.close(() => process.exit(1));
});

export default app;
