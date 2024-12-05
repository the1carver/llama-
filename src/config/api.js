import dotenv from 'dotenv';

dotenv.config();

export const API_CONFIG = {
  key: process.env.API_KEY,
  maxRequestsPerMinute: 60,
  timeout: 30000,
  baseUrl: process.env.API_URL || 'http://localhost:3000/api'
};