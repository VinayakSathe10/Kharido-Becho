// src/components/LaptopCard.jsx
import React from "react";

export default function LaptopCard({ laptop, onInquiry, requesting, isBooked }) {
  const photo =
    laptop?.laptopPhotos?.[0]?.photo_link ||
    "https://via.placeholder.com/300x200?text=No+Image";

  const status = (laptop.status || "").toUpperCase();
  const isSold = status === "SOLD";
  const isPending = status === "PENDING";

  const disabled = requesting || isSold || isPending || isBooked;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition">
      <div className="w-full h-40 rounded-md overflow-hidden relative">
        <img src={photo} alt={laptop.model} className="w-full h-full object-cover" />

        {isBooked && !isSold && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs rounded">
            Inquiry Sent
          </span>
        )}

        {(isPending || isSold) && (
          <span
            className={`absolute ${
              isBooked && !isSold ? "top-8" : "top-2"
            } left-2 px-2 py-1 text-xs rounded ${
              isSold ? "bg-red-600 text-white" : "bg-yellow-400 text-gray-900"
            }`}
          >
            {isSold ? "Sold" : "Pending"}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-3">
        {laptop.brand} {laptop.model}
      </h3>

      <p className="text-gray-600 text-sm mt-1">
        Processor: <span className="font-medium">{laptop.processor}</span>
      </p>

      <p className="text-gray-600 text-sm">Warranty: {laptop.warrantyInYear} year(s)</p>

      <p className="text-gray-900 font-bold text-xl mt-3">₹ {laptop.price}</p>

      <button
        disabled={disabled}
        onClick={() => onInquiry(laptop.id)}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
      >
        {isSold
          ? "Sold"
          : isBooked
          ? "Inquiry Sent"
          : requesting
          ? "Sending..."
          : "Send Inquiry"}
      </button>
    </div>
  );
}
