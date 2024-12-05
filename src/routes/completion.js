import { Router } from 'express';
import { generateCompletion } from '../controllers/completionController.js';
import { authMiddleware } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimit.js';

export const completionRouter = Router();

completionRouter.post('/', authMiddleware, rateLimiter, generateCompletion);