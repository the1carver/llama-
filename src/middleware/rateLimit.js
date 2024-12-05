import rateLimit from 'express-rate-limit';
import { API_CONFIG } from '../config/api.js';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: API_CONFIG.maxRequestsPerMinute,
  message: {
    error: {
      message: 'Too many requests, please try again later',
      status: 429
    }
  }
});