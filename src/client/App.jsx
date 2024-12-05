import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import API_CONFIG from './config/api';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(uuidv4());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: uuidv4(),
      content: message,
      role: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/completion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_CONFIG.key
        },
        body: JSON.stringify({
          prompt: message,
          sessionId: sessionId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response');
      }

      const data = await response.json();
      const botMessage = {
        id: uuidv4(),
        content: data.completion,
        role: 'assistant',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = {
        id: uuidv4(),
        content: `Error: ${error.message}`,
        role: 'error',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 min-h-[600px] flex flex-col">
          <div className="max-w-md mx-auto w-full h-full flex flex-col">
            <h1 className="text-2xl font-semibold mb-6 text-center text-gray-900">Llama Chat</h1>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-center">
                  <div className="animate-pulse text-gray-500">Thinking...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;