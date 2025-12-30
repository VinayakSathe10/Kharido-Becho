import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";

// ✅ Seller hook
import useChatSeller from "../../hook/useChatSeller";

const SellerChatModal = ({
  isOpen,
  onClose,
  bookingId,
  chatType = "BIKE",
}) => {
  const [inputValue, setInputValue] = useState("");

  // 🔥 Seller chat hook
  const { messages, loading, sending, error, sendMessage } =
    useChatSeller(bookingId);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      await sendMessage(inputValue); // seller handled inside hook
      setInputValue("");
    } catch (err) {
      console.error("Seller send failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold">Chat</h2>
          <button onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">

          {loading && <p className="text-sm text-gray-400">Loading...</p>}

          {(messages || []).map((msg, i) => {
            const isSeller = msg?.senderType === "SELLER";
            return (
              <div key={i} className={`flex ${isSeller ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-3 py-2 rounded-lg text-sm max-w-[75%]
          ${isSeller ? "bg-green-600 text-white" : "bg-gray-200 text-gray-900"}
        `}
                >
                  {msg?.content || msg?.content === "" ? msg.content : "Invalid message"}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {error && (
          <p className="text-xs text-red-500 px-4 pb-1">
            Chat sync failed
          </p>
        )}

        {/* INPUT */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 px-3 py-2 border-t"
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 border rounded px-3 py-2 text-sm"
            placeholder="Type your message..."
          />
          <button
            disabled={sending}
            className="bg-green-600 text-white px-4 rounded"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerChatModal;
