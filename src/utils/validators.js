export function validateCompletionRequest(body) {
  const { prompt, sessionId } = body;
  
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid prompt: must be a non-empty string');
  }

  if (sessionId && typeof sessionId !== 'string') {
    throw new Error('Invalid sessionId: must be a string');
  }

  return { prompt, sessionId };
}