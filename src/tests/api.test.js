import fetch from 'node-fetch';
import { API_CONFIG } from '../config/api.js';

const API_URL = 'http://localhost:3000/api';
const API_KEY = process.env.API_KEY;

async function testCompletion() {
  try {
    const response = await fetch(`${API_URL}/completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({
        prompt: 'Tell me a short story about a robot.',
        sessionId: 'test-session-1'
      })
    });

    const data = await response.json();
    console.log('Test 1 - Valid API Key:');
    console.log('Status:', response.status);
    console.log('Response:', data);
    console.log('---\n');

    // Test invalid API key
    const invalidResponse = await fetch(`${API_URL}/completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'invalid-key'
      },
      body: JSON.stringify({
        prompt: 'This should fail',
        sessionId: 'test-session-2'
      })
    });

    const invalidData = await invalidResponse.json();
    console.log('Test 2 - Invalid API Key:');
    console.log('Status:', invalidResponse.status);
    console.log('Response:', invalidData);
    console.log('---\n');

    // Test rate limiting
    console.log('Test 3 - Rate Limiting:');
    const requests = Array(70).fill().map(() => 
      fetch(`${API_URL}/completion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify({
          prompt: 'Quick test',
          sessionId: 'test-session-3'
        })
      })
    );

    const results = await Promise.all(requests);
    const rateLimited = results.filter(r => r.status === 429).length;
    console.log(`Rate limited responses: ${rateLimited}`);
    console.log('---\n');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

console.log('Starting API tests...\n');
testCompletion();