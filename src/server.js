import express from 'express';
import cors from 'cors';
import { setupRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { securityMiddleware } from './middleware/security.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS with more specific options
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-API-Key'],
  credentials: true
}));

// Basic middleware
app.use(express.json());
app.use(securityMiddleware);

// Routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`API Key configured: ${process.env.API_KEY ? 'Yes' : 'No'}`);
});