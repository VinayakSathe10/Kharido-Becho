import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getBikeBookingsForSeller } from "../../store/services/bikeBookingServices";
import SellerChatModal from "../Chat/SellerChatModal";

const SellerChatList = () => {
  const sellerId = Number(localStorage.getItem("sellerId"));

  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadPending = async () => {
      try {
        setLoading(true);

        const data = await getBikeBookingsForSeller(sellerId);

        const formatted = data.map((b) => ({
          bookingId: b.bookingId ?? b.id,
          title: `${b.bike?.brand || ""} ${b.bike?.model || ""}`.trim(),
          buyerName: `${b.buyer?.user?.firstName || ""} ${
            b.buyer?.user?.lastName || ""
          }`.trim(),
          status: b.status || b.bookingStatus || "PENDING",
        }));

        setChats(formatted);
      } catch (err) {
        console.error("Failed to load pending bike chats", err);
        toast.error("Failed to load pending bike chats");
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) loadPending();
    else setLoading(false);
  }, [sellerId]);

  const openChat = (bookingId) => {
    setSelectedBooking(bookingId);
    setIsModalOpen(true);
  };

  const closeChat = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">Pending Bike Requests</h1>
      </div>

      <div className="p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : chats.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No pending bike requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((c) => (
              <div
                key={c.bookingId}
                onClick={() => openChat(c.bookingId)}
                className="bg-white border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
              >
                <h2 className="font-semibold text-gray-900">{c.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Buyer: {c.buyerName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Status: {c.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <SellerChatModal
          isOpen={isModalOpen}
          onClose={closeChat}
          bookingId={selectedBooking}
          chatType="BIKE"
        />
      )}
    </div>
  );
};

export default SellerChatList;
