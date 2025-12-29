import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getBookingsForBuyer } from "../../store/services/bikeBookingServices";
import { getLaptopBookingsByBuyer } from "../../store/services/laptopBookingServices";

const BuyerChatList = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("CAR");
  const [bikeChats, setBikeChats] = useState([]);
  const [laptopChats, setLaptopChats] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Static dummy data (CAR & MOBILE)
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
  };

  // ---------------- LOAD BIKE BOOKINGS ----------------
  useEffect(() => {
    if (activeTab !== "BIKE") return;

    const loadBikeChats = async () => {
      const buyerId = Number(localStorage.getItem("buyerId"));
      if (!buyerId) return toast.error("Buyer not logged in");

      try {
        setLoading(true);
        const data = await getBookingsForBuyer(buyerId);

        const formatted = data.map((b) => ({
          bookingId: b.bookingId,
          title: `${b.bike?.brand || ""} ${b.bike?.model || ""}`,
          sellerName: b.seller?.user?.name || "Seller",
          status: b.status || "PENDING",
        }));

        setBikeChats(formatted);
      } catch {
        toast.error("Failed to load bike chats");
      } finally {
        setLoading(false);
      }
    };

    loadBikeChats();
  }, [activeTab]);

  // ---------------- LOAD LAPTOP BOOKINGS ----------------
  useEffect(() => {
    if (activeTab !== "LAPTOP") return;

    const loadLaptopChats = async () => {
      const buyerId = Number(localStorage.getItem("buyerId"));
      if (!buyerId) return toast.error("Buyer not logged in");

      try {
        setLoading(true);
        const data = await getLaptopBookingsByBuyer(buyerId);

        const formatted = data.map((b) => ({
          bookingId: b.laptopBookingId,
          title: `Laptop #${b.laptopId}`,
          sellerName: b.sellerName,
          status: b.status || "PENDING",
        }));

        setLaptopChats(formatted);
      } catch {
        toast.error("Failed to load laptop chats");
      } finally {
        setLoading(false);
      }
    };

    loadLaptopChats();
  }, [activeTab]);

  const chats =
    activeTab === "BIKE"
      ? bikeChats
      : activeTab === "LAPTOP"
      ? laptopChats
      : chatsByType[activeTab];

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
              className={`py-3 border-b-2 ${
                activeTab === tab
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
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : chats.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No requests yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((c) => (
              <div
                key={c.bookingId}
                onClick={() =>
                  activeTab === "LAPTOP"
                    ? navigate(`/chat/laptop/${c.bookingId}`)
                    : navigate(`/buyer/chat/${c.bookingId}`)
                }
                className="cursor-pointer bg-white border rounded-lg p-4 hover:shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-sm text-gray-500">
                    Seller: {c.sellerName}
                  </p>
                  <p className="text-xs text-gray-400">Status: {c.status}</p>
                </div>

                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-200 text-gray-700">
                  {activeTab}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerChatList;
