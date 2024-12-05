import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error('Error:', err.message);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
}