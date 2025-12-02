import React from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerChatList = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border px-4 py-3">
        <h1 className="text-xl font-bold text-text-primary">Chats</h1>
      </div>
      <div className="p-4">
        <div className="text-center py-12 text-text-tertiary">
          <p>No chats yet</p>
          <p className="text-sm mt-2">Start chatting with sellers</p>
        </div>
      </div>
    </div>
  );
};

export default BuyerChatList;

