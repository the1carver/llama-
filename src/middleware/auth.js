import { API_CONFIG } from '../config/api.js';
import { logger } from '../utils/logger.js';

export function authMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== API_CONFIG.key) {
    logger.warn('Invalid API key attempt');
    return res.status(401).json({
      error: {
        message: 'Invalid API key',
        status: 401
      }
    });
  }

  next();
}