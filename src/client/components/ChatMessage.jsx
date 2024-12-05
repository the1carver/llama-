import React from 'react';

function ChatMessage({ message }) {
  const { role, content, timestamp } = message;
  
  const messageClasses = {
    user: 'bg-blue-100 text-blue-800',
    assistant: 'bg-gray-100 text-gray-800',
    error: 'bg-red-100 text-red-800'
  };

  const alignmentClasses = role === 'user' ? 'ml-auto' : 'mr-auto';

  return (
    <div className={`max-w-[80%] ${alignmentClasses} rounded-lg px-4 py-2 ${messageClasses[role]}`}>
      <div className="text-sm">{content}</div>
      <div className="text-xs text-gray-500 mt-1">
        {new Date(timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}

export default ChatMessage;