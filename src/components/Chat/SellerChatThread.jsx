import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import ChatModal from "./ChatModal";

const SellerChatThreadScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const bookingId = id;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-white border-b border-border px-4 py-3 flex items-center relative z-50">
        <button
          onClick={() => navigate("/seller/chat")}
          className="mr-4 p-2"
          type="button"
        >
          <MdArrowBack className="text-2xl text-text-primary" />
        </button>
        <h1 className="text-xl font-bold text-text-primary">Chat</h1>
      </div>

      {/* Full-screen modal for seller chat bound to this booking */}
      <ChatModal
        isOpen
        onClose={() => navigate("/seller/chat")}
        bookingId={bookingId}
        senderType="SELLER"
      />
    </div>
  );
};

export default SellerChatThreadScreen;

