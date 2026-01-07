import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getLaptopById } from "../../../store/services/laptopServices";
import { fetchBuyerInfo } from "../../../store/services/authServices";
import { createBooking as createLaptopBooking } from "../../../store/services/laptopBookingServices";

import MakeOfferModal from "../../../components/Car/MakeOfferModal";
import ChatModal from "../../Chat/ChatModal";

import {
    FaLaptop,
    FaMapMarkerAlt,
    FaRegCalendarAlt,
    FaMicrochip,
    FaMemory,
    FaBatteryFull,
    FaUsb,
    FaPalette,
    FaHashtag,
    FaWeight,
    FaUserTie,
    FaShieldAlt
} from "react-icons/fa";

export default function LaptopDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const [laptop, setLaptop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [offerOpen, setOfferOpen] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [isBooked, setIsChatOpenBooked] = useState(false);
    const [requesting, setRequesting] = useState(false);
    const [mainPhoto, setMainPhoto] = useState(null);

    useEffect(() => {
        loadLaptop();
        ensureIdsSaved();
    }, [id]);

    const loadLaptop = async () => {
        try {
            setLoading(true);
            const data = await getLaptopById(id);
            setLaptop(data || null);

            const photos = data?.laptopPhotos || data?.images || [];
            if (photos.length > 0) setMainPhoto(photos[0].image_link || photos[0].photo_link);
        } catch {
            toast.error("Failed to load laptop");
        } finally {
            setLoading(false);
        }
    };

    const readUserFromLocal = () => {
        try {
            const raw = localStorage.getItem("user") || localStorage.getItem("authUser");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };

    const ensureIdsSaved = async () => {
        try {
            const u = readUserFromLocal();
            const baseUserId = u?.userId || u?.user?.id || u?.id || localStorage.getItem("userId");

            if (!baseUserId) return;

            if (!localStorage.getItem("buyerId")) {
                try {
                    const buyer = await fetchBuyerInfo(baseUserId);
                    if (buyer?.buyerId) {
                        localStorage.setItem("buyerId", buyer.buyerId);
                        localStorage.setItem("buyerUserId", buyer.user?.id || baseUserId);
                    }
                } catch { }
            }
        } catch { }
    };

    const handleMakeOffer = async () => {
        const buyerId = Number(localStorage.getItem("buyerId"));
        const userId = Number(localStorage.getItem("buyerUserId"));

        if (!buyerId || !userId) {
            toast.error("Please login as buyer");
            return;
        }

        try {
            setRequesting(true);
            const res = await createLaptopBooking(
                laptop.laptop_id || laptop.laptopId || id,
                buyerId,
                userId,
                "Interested in this laptop"
            );

            setBookingId(res.bookingId);
            localStorage.setItem("laptopBookingId", res.bookingId);
            toast.success("Offer sent successfully");
            setIsChatOpenBooked(true);
            setOfferOpen(true);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Offer failed");
        } finally {
            setRequesting(false);
        }
    };

    const openChat = () => {
        const storedBooking = bookingId || localStorage.getItem("laptopBookingId");
        if (!storedBooking) {
            toast.error("Please make an offer first");
            return;
        }
        setIsChatOpen(true);
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!laptop) return <div className="p-6">Laptop not found</div>;

    const photos = laptop.laptopPhotos || laptop.images || [];
    const price = laptop.prize ?? laptop.price ?? 0;

    const status = (laptop.status || "").toUpperCase();
    const isPending = status === "PENDING";
    const isSold = status === "SOLD";
    const disabled = requesting || isPending || isSold || isBooked;

    const buttonLabel = isSold ? "Sold" : isPending ? "Pending" : isBooked ? "Offer Sent" : requesting ? "Sending..." : "Send Offer";

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-4">
                <Link to="/">Home</Link> / <Link to="/buy/laptops">Laptops</Link> / {laptop.brand} {laptop.model}
            </div>

            <div className="lg:flex lg:gap-8">
                {/* Main Image */}
                <div className="lg:w-1/2">
                    {mainPhoto ? (
                        <img src={mainPhoto} alt="Laptop" className="w-full h-80 object-cover rounded-lg shadow" />
                    ) : (
                        <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">No Image</div>
                    )}

                    {photos.length > 1 && (
                        <div className="grid grid-cols-4 gap-3 mt-4">
                            {photos.map((p, i) => {
                                const src = p.image_link || p.photo_link;
                                return (
                                    <img key={i} src={src} alt="Laptop" className="h-20 w-full object-cover rounded cursor-pointer border-2 border-gray-300 hover:border-blue-500" onClick={() => setMainPhoto(src)} />
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Important Info */}
                <div className="lg:w-1/2 mt-6 lg:mt-0">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FaLaptop className="text-blue-600" />
                        {laptop.brand} {laptop.model}
                    </h1>
                    <p className="text-green-600 font-bold text-2xl mt-2">₹ {Number(price).toLocaleString()}</p>

                    {/* Short Specs */}
                    <div className="flex flex-wrap gap-4 text-gray-700 mt-4">
                        <SpecBox icon={<FaMicrochip />} value={laptop.processor} />
                        <SpecBox icon={<FaMemory />} value={laptop.ram} />
                        <SpecBox icon={<FaBatteryFull />} value={laptop.battery} />
                        <SpecBox icon={<FaHashtag />} value={`S/N: ${laptop.serialNumber}`} />
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 space-y-3">
                        <button disabled={disabled} onClick={handleMakeOffer} className="w-full py-3 bg-blue-600 text-white rounded-md disabled:opacity-60">
                            {buttonLabel}
                        </button>
                        <button onClick={openChat} className="w-full py-3 bg-green-600 text-white rounded-md">Chat With Dealer</button>

                        <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} bookingId={bookingId || localStorage.getItem("laptopBookingId")} senderType="BUYER" chatType="LAPTOP" />
                    </div>
                </div>
            </div>

            {/* Additional Details */}
            <div className="mt-8 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Laptop Specifications</h2>

                <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                    <Detail icon={<FaUserTie />} label="Dealer" value={laptop.dealer} />
                    <Detail icon={<FaHashtag />} label="Serial Number" value={laptop.serialNumber} />
                    <Detail icon={<FaShieldAlt />} label="Brand" value={laptop.processorBrand} />
                    <Detail icon={<FaMicrochip />} label="Processor" value={laptop.processor} />
                    <Detail icon={<FaShieldAlt />} label="Processor Brand" value={laptop.processorBrand} />
                    <Detail icon={<FaMemory />} label="RAM" value={laptop.ram} />
                    <Detail icon={<FaUsb />} label="USB Ports" value={laptop.usbPorts} />
                    <Detail icon={<FaMemory />} label="Memory Type" value={laptop.memoryType} />
                    <Detail icon={<FaLaptop />} label="Screen Size" value={`${laptop.screenSize} Inch`} />
                    <Detail icon={<FaPalette />} label="Colour" value={laptop.colour} />
                    <Detail icon={<FaMemory />} label="Storage" value={laptop.storage} />
                    <Detail icon={<FaBatteryFull />} label="Battery Life" value={laptop.batteryLife} />
                    <Detail icon={<FaBatteryFull />} label="Battery Backup" value={laptop.batteryLife} />
                    <Detail icon={<FaShieldAlt />} label="Warranty" value={`${laptop.warrantyInYear} Year`} />
                    <Detail icon={<FaWeight />} label="Weight" value={`${laptop.weight} kg`} />
                    <Detail icon={<FaShieldAlt />} label="Graphics Card" value={laptop.graphicsCard} />
                    <Detail icon={<FaShieldAlt />} label="Graphics Brand" value={laptop.graphicBrand} />
                    <Detail icon={<FaLaptop />} label="Manufacturer" value={laptop.manufacturer} />
                    <Detail icon={<FaUsb />} label="USB Ports" value={laptop.usbPorts} />
                </div>
            </div>

            {/* Description */}
            {laptop.description && (
                <div className="mt-6 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-3">Description</h2>
                    <p className="text-gray-700">{laptop.description}</p>
                </div>
            )}

            {/* Offer Modal */}
            <MakeOfferModal open={offerOpen} onClose={() => setOfferOpen(false)} laptopId={laptop.laptopId || laptop.id} type="laptop" bookingId={bookingId} />
        </div>
    );
}

function Detail({ icon, label, value }) {
    return <div className="flex items-center gap-2 border-b py-2"><span className="text-blue-600">{icon}</span><span className="font-semibold">{label}:</span><span>{value || "N/A"}</span></div>;
}

function SpecBox({ icon, value }) {
    return <div className="flex flex-col items-center"><p className="text-blue-600 text-2xl">{icon}</p><p className="font-semibold">{value || "-"}</p></div>;
}
