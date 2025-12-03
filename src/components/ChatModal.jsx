import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import useChat from "../hooks/useChat";

/**
 * Generic chat modal bound to a specific bike booking.
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - bookingId: string | number
 * - senderType: "BUYER" | "SELLER" (used when sending new messages)
 */
const ChatModal = ({ isOpen, onClose, bookingId, senderType = "BUYER" }) => {
  const [inputValue, setInputValue] = useState("");
  const { messages, loading, sending, error, sendMessage } =
    useChat(bookingId);

  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message whenever the list changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    try {
      await sendMessage(trimmed, senderType);
      setInputValue("");
    } catch {
      // Errors are handled inside the hook; keep UX simple here.
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md md:max-w-lg lg:max-w-xl rounded-lg shadow-xl flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            Chat with Seller
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 flex flex-col px-4 py-3 overflow-hidden">
          {loading && messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
              Loading chat...
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {messages.length === 0 && !loading ? (
                <p className="text-xs text-gray-400 text-center mt-4">
                  No messages yet. Start the conversation!
                </p>
              ) : null}

              {messages.map((msg) => {
                const isBuyer = msg.senderType === "BUYER";
                const isSeller = msg.senderType === "SELLER";

                const alignment = isBuyer ? "items-end" : "items-start";
                const bubbleClasses = isBuyer
                  ? "bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl"
                  : "bg-gray-200 text-gray-900 rounded-r-2xl rounded-tl-2xl";

                return (
                  <div
                    key={msg.id || `${msg.senderType}-${msg.createdAt}`}
                    className={`flex ${alignment}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 text-sm ${bubbleClasses}`}
                    >
                      <p>{msg.content}</p>
                      {msg.optimistic && (
                        <p className="mt-0.5 text-[10px] opacity-70">
                          Sending...
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}

          {error && (
            <p className="mt-2 text-[11px] text-red-500">
              Failed to sync chat. You can still try sending messages.
            </p>
          )}
        </div>

        {/* INPUT */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 px-3 py-2 flex items-center gap-2"
        >
          <input
            type="text"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || sending}
            className="px-4 py-2 text-sm font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;


