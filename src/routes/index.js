import { Router } from 'express';
import { completionRouter } from './completion.js';

export function setupRoutes(app) {
  const apiRouter = Router();
  
  apiRouter.use('/completion', completionRouter);
  
  app.use('/api', apiRouter);
}