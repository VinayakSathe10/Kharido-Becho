import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';

const BuyerChatThreadScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-white border-b border-border px-4 py-3 flex items-center">
        <button
          onClick={() => navigate('/buyer/chat')}
          className="mr-4 p-2"
          type="button"
        >
          <MdArrowBack className="text-2xl text-text-primary" />
        </button>
        <h1 className="text-xl font-bold text-text-primary">Chat</h1>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-text-tertiary">
          <p>Chat ID: {id}</p>
          <p className="text-sm mt-2">Chat interface will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default BuyerChatThreadScreen;

