import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function LaptopCard({ laptop }) {
    const navigate = useNavigate();

    const imageUrl =
        laptop.laptopPhotos?.[0]?.photo_link ||
        laptop.images?.[0]?.image_link ||
        laptop.image ||
        "https://via.placeholder.com/350x230?text=No+Image";

    const handleViewDetails = (e) => {
        e.preventDefault();
        navigate(`/buy/laptops/${laptop.laptop_id || laptop.laptopId}`);
    };

    return (
        <div
            onClick={handleViewDetails}
            className="bg-white rounded-xl shadow hover:shadow-xl transition p-3 cursor-pointer"
        >
            {/* Image */}
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img
                    src={imageUrl}
                    alt={`${laptop.brand} ${laptop.model}`}
                    className="w-full h-full object-cover"
                />

                {/* Heart Icon */}
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                >
                    <FaRegHeart size={18} />
                </button>

                {/* Featured Badge */}
                {laptop?.featured && (
                    <span className="absolute bottom-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-yellow-300">
                        FEATURED
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="mt-3">
                <p className="text-xl font-bold text-gray-800">
                    ₹ {(laptop.prize || laptop.price || 0).toLocaleString()}
                </p>

                <p className="text-gray-600 text-sm">
                    {laptop.manufactureYear || laptop.year || "2025"} • {laptop.usage || laptop.km || "Not Used"}
                </p>

                <h2 className="text-md font-semibold mt-1">
                    {laptop.brand} {laptop.model}
                </h2>

                <p className="text-gray-500 text-sm">
                    {laptop.location || "India"}
                </p>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <span>{laptop.location || "India"}</span>
                <span>{laptop.date || "Jan 2026"}</span>
            </div>

            {/* View Details Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(e);
                }}
                className="w-full mt-3 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700"
            >
                View Details
            </button>
        </div>
    );
}
