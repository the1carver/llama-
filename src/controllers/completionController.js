import { pipeline } from '@xenova/transformers';
import { logger } from '../utils/logger.js';
import { validateCompletionRequest } from '../utils/validators.js';
import { MODEL_CONFIG } from '../config/model.js';

let model = null;

async function initModel() {
  if (!model) {
    try {
      model = await pipeline('text-generation', MODEL_CONFIG.modelName);
      logger.info('Model initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize model:', error);
      throw error;
    }
  }
  return model;
}

export async function generateCompletion(req, res, next) {
  try {
    const { prompt, sessionId } = validateCompletionRequest(req.body);
    
    if (!model) {
      await initModel();
    }

    const response = await model(prompt, {
      max_length: MODEL_CONFIG.maxTokens,
      temperature: MODEL_CONFIG.temperature,
      top_p: MODEL_CONFIG.topP
    });

    logger.info('Generated completion successfully');
    
    res.json({
      completion: response[0].generated_text,
      sessionId: sessionId
    });
  } catch (error) {
    logger.error('Completion generation failed:', error);
    next(error);
  }
}