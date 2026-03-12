import React from 'react';

// Multilingual chatbot interface
export default function ChatWidget() {
  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border shadow-lg rounded-lg flex flex-col">
      <div className="p-4 bg-green-600 text-white font-bold rounded-t-lg">Health Assistant</div>
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-sm text-gray-500">Namaste! How can I help you today?</p>
      </div>
      <div className="p-4 border-t flex">
        <input type="text" className="flex-1 border rounded px-2 py-1" placeholder="Type your symptoms..." />
        <button className="ml-2 bg-green-600 text-white px-3 py-1 rounded">Send</button>
      </div>
    </div>
  );
}