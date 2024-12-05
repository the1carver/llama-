import fs from 'fs';
import path from 'path';
import https from 'https';
import { logger } from './logger.js';
import { MODEL_CONFIG } from '../config/model.js';

const MODEL_URL = 'https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf';
const MODEL_DIR = path.dirname(MODEL_CONFIG.modelPath);

export async function downloadModel() {
  const modelPath = path.resolve(MODEL_CONFIG.modelPath);

  // Create models directory if it doesn't exist
  if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
  }

  // Check if model already exists
  if (fs.existsSync(modelPath)) {
    logger.info('Model file already exists');
    return;
  }

  logger.info('Downloading model file...');

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(modelPath);
    https.get(MODEL_URL, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download model: ${response.statusCode}`));
        return;
      }

      const totalSize = parseInt(response.headers['content-length'], 10);
      let downloadedSize = 0;

      response.on('data', chunk => {
        downloadedSize += chunk.length;
        const progress = (downloadedSize / totalSize) * 100;
        process.stdout.write(`Download progress: ${progress.toFixed(2)}%\r`);
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        logger.info('Model download completed');
        resolve();
      });

      file.on('error', err => {
        fs.unlink(modelPath, () => {});
        reject(err);
      });
    }).on('error', err => {
      fs.unlink(modelPath, () => {});
      reject(err);
    });
  });
}