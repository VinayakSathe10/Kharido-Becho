import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BuyerChatThread from "./BuyerChatThread";

import { getBookingsForBuyer } from "../../store/services/bikeBookingServices";

import ChatListItem from "../../components/Chat/ChatListItem";

const BuyerChatList = () => {
  // State for inline master-detail view
  const [selectedChat, setSelectedChat] = useState(null);

  const [activeTab, setActiveTab] = useState("CAR");
  const [bikeChats, setBikeChats] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Static dummy data (unchanged)
  const chatsByType = {
    CAR: [
      {
        bookingId: 1,
        title: "Honda City",
        sellerName: "Rahul",
        status: "PENDING",
      },
    ],
    MOBILE: [
      {
        bookingId: 3,
        title: "iPhone 13",
        sellerName: "Suresh",
        status: "PENDING",
      },
    ],
    LAPTOP: [
      {
        bookingId: 4,
        title: "MacBook Air",
        sellerName: "Neha",
        status: "APPROVED",
      },
    ],
  };

  // ---------------- LOAD BIKE BOOKINGS ----------------
  useEffect(() => {
    const loadBikeChats = async () => {
      const buyerId = Number(localStorage.getItem("buyerId"));

      if (!buyerId) {
        toast.error("Buyer not logged in");
        return;
      }

      try {
        setLoading(true);
        const data = await getBookingsForBuyer(buyerId);
        console.log(data, "data =====");
        // 🔁 Normalize backend response
        const formatted = data.map((b) => ({
          bookingId: b.bookingId || b.id,
          title: `${b.bike?.brand || ""} ${b.bike?.model || ""}`,
          sellerName: b?.bike?.seller?.user?.firstName || "Seller",
          status: b.status || "PENDING",
        }));
        console.log(formatted, "formatted =====");
        setBikeChats(formatted);
      } catch (err) {
        toast.error("Failed to load bike chats");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "BIKE") {
      loadBikeChats();
    }
  }, [activeTab]);

  const chats =
    activeTab === "BIKE" ? bikeChats : chatsByType[activeTab];

  // Master-Detail View
  if (selectedChat) {
    return (
      <BuyerChatThread
        bookingId={selectedChat.bookingId}
        chatType={activeTab}
        chatTitle={selectedChat.title}
        chatSubtitle={selectedChat.sellerName}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold">Requests</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-4">
        <div className="flex space-x-6 text-sm font-semibold">
          {["CAR", "BIKE", "MOBILE", "LAPTOP"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 border-b-2 ${activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Loading...
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No requests yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <ChatListItem
                key={chat.bookingId}
                title={chat.title}
                subtitle={`Seller: ${chat.sellerName}`}
                status={chat.status}
                tag={activeTab}
                onClick={() => setSelectedChat(chat)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerChatList;
