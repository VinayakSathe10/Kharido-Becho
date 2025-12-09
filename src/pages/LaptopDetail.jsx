// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { toast } from "react-toastify";

// // SERVICES
// import { getLaptopById } from "../../store/services/laptopServices";
// import {
//   createLaptopBooking,
//   getLaptopBookingByBuyer,
// } from "../../store/services/laptopBookingServices";

// // Icons
// import {
//   FaMicrochip,
//   FaMemory,
//   FaHdd,
//   FaMapMarkerAlt,
//   FaUser,
// } from "react-icons/fa";

// export default function LaptopDetail() {
//   const { id } = useParams();
//   const [laptop, setLaptop] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadLaptop();
//   }, []);

//   const loadLaptop = async () => {
//     setLoading(true);
//     try {
//       const data = await getLaptopById(id);
//       setLaptop(data);
//     } catch (err) {
//       toast.error("Failed to load laptop details");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ======================================================
//      MAKE OFFER (Creates booking + saves buyerId)
//   ====================================================== */
//   const handleMakeOffer = async () => {
//     const buyerUserId = localStorage.getItem("buyerUserId");

//     if (!buyerUserId) {
//       toast.error("Please login as a buyer to make an offer");
//       return;
//     }

//     const payload = {
//       laptopId: Number(id),
//       buyerUserId: Number(buyerUserId),
//       message: "Hi, I am interested in buying this laptop.",
//       bookingDate: new Date().toISOString().split("T")[0],
//     };

//     try {
//       const booking = await createLaptopBooking(payload);

//       // ⭐ Save buyerId returned by backend (IMPORTANT)
//       localStorage.setItem("buyerId", booking.buyerId);

//       toast.success("Offer sent successfully!");
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to send offer");
//     }
//   };

//   /* ======================================================
//      CHAT WITH SELLER (Uses buyerId instead of buyerUserId)
//   ====================================================== */
//   const handleChat = async () => {
//     const buyerUserId = Number(localStorage.getItem("buyerUserId"));
//     const buyerId = Number(localStorage.getItem("buyerId"));

//     if (!buyerUserId) {
//       toast.error("Please login as buyer to chat with seller");
//       return;
//     }

//     // ⛔ Buyer must create booking first (backend requires buyerId)
//     if (!buyerId) {
//       toast.error("Please click 'Make Offer' first to start chat.");
//       return;
//     }

//     try {
//       // Use CORRECT buyerId — fixes 400 BAD REQUEST
//       const response = await getLaptopBookingByBuyer(buyerId);

//       const existingBooking = response.find((b) => b.laptopId === Number(id));

//       let bookingId;

//       if (existingBooking) {
//         bookingId = existingBooking.laptopBookingId;
//       } else {
//         // Create new booking for chat
//         const payload = {
//           laptopId: Number(id),
//           buyerUserId: buyerUserId,
//           message: "Hi, I want to chat regarding your laptop.",
//           bookingDate: new Date().toISOString().split("T")[0],
//         };

//         const newBooking = await createLaptopBooking(payload);

//         // Update buyerId in storage
//         localStorage.setItem("buyerId", newBooking.buyerId);

//         bookingId = newBooking.laptopBookingId;
//       }

//       // Navigate to chat
//       window.location.href = `/chat/laptop/${bookingId}`;
//     } catch (error) {
//       console.error("Chat error:", error);
//       toast.error("Unable to start chat");
//     }
//   };

//   if (loading) return <p className="p-4">Loading...</p>;
//   if (!laptop) return <p className="p-4">Laptop not found.</p>;

//   const photos = laptop?.laptopPhotos || [];

//   return (
//     <div className="container mx-auto px-4 py-6 pb-24">
//       {/* ⭐ Breadcrumb */}
//       <div className="text-sm text-gray-600 mb-4">
//         <Link to="/" className="hover:underline">
//           Home
//         </Link>{" "}
//         /
//         <Link to="/buy/laptops" className="hover:underline ml-1">
//           Laptops
//         </Link>{" "}
//         /
//         <span className="text-gray-900 font-semibold ml-1">
//           {laptop.brand} {laptop.model}
//         </span>
//       </div>

//       {/* 🔥 TOP SECTION */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//         {/* 📸 Left - Image Gallery */}
//         <div>
//           <img
//             src={
//               photos.length > 0
//                 ? photos[0].photo_link
//                 : "https://via.placeholder.com/600"
//             }
//             alt={laptop.model}
//             className="w-full rounded-lg shadow-lg object-cover h-80 md:h-[420px] transition-transform duration-300 hover:scale-[1.02]"
//           />

//           {photos.length > 1 && (
//             <div className="grid grid-cols-3 gap-4 mt-4">
//               {photos.slice(1).map((p, index) => (
//                 <img
//                   key={index}
//                   src={p.photo_link}
//                   className="w-full h-28 object-cover rounded-md shadow hover:scale-105 transition"
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* 📝 Right Section */}
//         <div>
//           <h1 className="text-4xl font-bold mb-2">
//             {laptop.brand} {laptop.model}
//           </h1>

//           <p className="text-3xl font-bold text-green-700 mb-4">
//             ₹ {laptop.price}
//           </p>

//           {/* Key Specs */}
//           <div className="flex items-center gap-5 bg-blue-50 p-4 rounded-xl shadow mb-6">
//             <SpecIcon
//               icon={<FaMicrochip className="text-blue-600 text-2xl" />}
//               value={laptop.processor}
//               label="Processor"
//             />
//             <SpecIcon
//               icon={<FaMemory className="text-blue-600 text-2xl" />}
//               value={laptop.ram}
//               label="RAM"
//             />
//             <SpecIcon
//               icon={<FaHdd className="text-blue-600 text-2xl" />}
//               value={laptop.storage}
//               label="Storage"
//             />
//           </div>

//           <p className="flex items-center text-gray-700 mb-2">
//             <FaMapMarkerAlt className="mr-2 text-blue-600" />
//             {laptop.location || "N/A"}
//           </p>

//           <p className="text-gray-700 text-lg mb-6">
//             <span className="font-semibold">Condition:</span> {laptop.condition}
//           </p>

//           {/* ACTION BUTTONS */}
//           <div className="flex flex-col gap-3">
//             <button
//               onClick={handleMakeOffer}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full text-lg shadow-lg"
//             >
//               Make Offer
//             </button>

//             <button
//               onClick={handleChat}
//               className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg w-full text-lg shadow-lg"
//             >
//               Chat With Seller
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Specifications */}
//       <div className="mt-12 bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-2xl font-bold mb-4">Specifications</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
//           <Spec label="Brand" value={laptop.brand} />
//           <Spec label="Model" value={laptop.model} />
//           <Spec label="Processor" value={laptop.processor} />
//           <Spec label="RAM" value={laptop.ram} />
//           <Spec label="Storage" value={laptop.storage} />
//           <Spec label="Graphics" value={laptop.graphics || "N/A"} />
//           <Spec label="Display" value={laptop.display || "N/A"} />
//           <Spec label="Battery" value={laptop.battery || "N/A"} />
//           <Spec label="Operating System" value={laptop.os || "N/A"} />
//           <Spec label="Color" value={laptop.color || "N/A"} />
//           <Spec label="Warranty" value={`${laptop.warrantyInYear} Year(s)`} />
//           <Spec label="Age" value={laptop.age || "N/A"} />
//         </div>
//       </div>

//       {/* Description */}
//       <div className="mt-10 bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-2xl font-bold mb-3">Description</h2>
//         <p className="text-gray-700 leading-relaxed">
//           {laptop.description || "No description provided."}
//         </p>
//       </div>

//       {/* Seller */}
//       <div className="mt-10 bg-white shadow-md rounded-lg p-6 flex items-center gap-4">
//         <div className="bg-blue-100 p-4 rounded-full">
//           <FaUser className="text-blue-700 text-3xl" />
//         </div>

//         <div>
//           <h2 className="text-xl font-bold">Seller Information</h2>
//           <p className="text-gray-gray">
//             <span className="font-semibold">Name:</span> {laptop.sellerName}
//           </p>
//           <p className="text-gray-gray">
//             <span className="font-semibold">Contact:</span>{" "}
//             {laptop.sellerContact || "N/A"}
//           </p>
//         </div>
//       </div>

//       {/* MOBILE BOTTOM BAR */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex md:hidden gap-3">
//         <button
//           onClick={handleMakeOffer}
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg flex-1"
//         >
//           Offer
//         </button>

//         <button
//           onClick={handleChat}
//           className="bg-green-600 text-white px-6 py-2 rounded-lg flex-1"
//         >
//           Chat
//         </button>
//       </div>
//     </div>
//   );
// }

// function Spec({ label, value }) {
//   return (
//     <p className="flex justify-between border-b py-2">
//       <span className="font-semibold">{label}</span>
//       <span>{value}</span>
//     </p>
//   );
// }

// function SpecIcon({ icon, value, label }) {
//   return (
//     <div className="flex flex-col items-center">
//       {icon}
//       <p className="font-semibold">{value}</p>
//       <p className="text-xs text-gray-500">{label}</p>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

// SERVICES
import { getLaptopById } from "../store/services/laptopServices";
import {
  createLaptopBooking,
  getLaptopBookingByBuyer,
} from "../store/services/laptopBookingServices";

// Icons
import {
  FaMicrochip,
  FaMemory,
  FaHdd,
  FaBatteryThreeQuarters,
  FaPalette,
  FaMobileAlt,
  FaLaptop,
  FaWeightHanging,
  FaIndustry,
  FaUsb,
  FaCogs,
  FaRegClock,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";

export default function LaptopDetail() {
  const { id } = useParams();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLaptop();
  }, []);

  const loadLaptop = async () => {
    setLoading(true);
    try {
      const data = await getLaptopById(id);
      setLaptop(data);
    } catch (err) {
      toast.error("Failed to load laptop details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = async () => {
    const buyerUserId = localStorage.getItem("buyerUserId");

    if (!buyerUserId) {
      toast.error("Please login as a buyer to make an offer");
      return;
    }

    const payload = {
      laptopId: Number(id),
      buyerUserId: Number(buyerUserId),
      message: "Hi, I am interested in this laptop.",
      bookingDate: new Date().toISOString().split("T")[0],
    };

    try {
      const booking = await createLaptopBooking(payload);

      localStorage.setItem("buyerId", booking.buyerId);

      toast.success("Offer sent successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send offer");
    }
  };

  const handleChat = async () => {
    const buyerUserId = Number(localStorage.getItem("buyerUserId"));
    const buyerId = Number(localStorage.getItem("buyerId"));

    if (!buyerUserId) {
      toast.error("Please login as buyer to chat with seller");
      return;
    }

    if (!buyerId) {
      toast.error("Please make an offer first to start chat.");
      return;
    }

    try {
      const response = await getLaptopBookingByBuyer(buyerId);

      const existingBooking = response.find((b) => b.laptopId === Number(id));

      let bookingId;

      if (existingBooking) {
        bookingId = existingBooking.laptopBookingId;
      } else {
        const payload = {
          laptopId: Number(id),
          buyerUserId: buyerUserId,
          message: "Hi, I want to chat regarding your laptop.",
          bookingDate: new Date().toISOString().split("T")[0],
        };

        const newBooking = await createLaptopBooking(payload);

        localStorage.setItem("buyerId", newBooking.buyerId);

        bookingId = newBooking.laptopBookingId;
      }

      window.location.href = `/chat/laptop/${bookingId}`;
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Unable to start chat");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!laptop) return <p className="p-4">Laptop not found.</p>;

  const photos = laptop.laptopPhotos || [];

  const seller =
    laptop.bookings?.length > 0 ? laptop.bookings[0].seller?.user : null;

  const sellerName = seller
    ? `${seller.firstName} ${seller.lastName}`
    : "Not Available";

  const sellerContact = seller?.mobileNumber || "Not Available";

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        /
        <Link to="/buy/laptops" className="hover:underline ml-1">
          Laptops
        </Link>{" "}
        /
        <span className="text-gray-900 font-semibold ml-1">
          {laptop.brand} {laptop.model}
        </span>
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT: IMAGES */}
        <div>
          <img
            src={
              photos.length > 0
                ? photos[0].photo_link
                : "https://via.placeholder.com/600"
            }
            alt={laptop.model}
            className="w-full rounded-lg shadow-lg object-cover h-80 md:h-[420px] transition hover:scale-[1.01]"
          />

          {photos.length > 1 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {photos.slice(1).map((p, idx) => (
                <img
                  key={idx}
                  src={p.photo_link}
                  className="w-full h-24 object-cover rounded-md shadow hover:scale-105"
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: DETAILS */}
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {laptop.brand} {laptop.model}
          </h1>

          <p className="text-3xl font-bold text-green-700 mb-4">
            ₹ {laptop.price}
          </p>

          {/* Main Specs Icons */}
          <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-xl shadow mb-6">
            <SpecIcon
              icon={<FaMicrochip />}
              label="Processor"
              value={laptop.processor}
            />
            <SpecIcon icon={<FaMemory />} label="RAM" value={laptop.ram} />
            <SpecIcon icon={<FaHdd />} label="Storage" value={laptop.storage} />
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleMakeOffer}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full text-lg shadow"
            >
              Make Offer
            </button>

            <button
              onClick={handleChat}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg w-full text-lg shadow"
            >
              Chat With Seller
            </button>
          </div>
        </div>
      </div>

      {/* SPECIFICATIONS */}
      <div className="mt-12 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Specifications</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SpecRow icon={<FaLaptop />} label="Brand" value={laptop.brand} />
          <SpecRow icon={<FaLaptop />} label="Model" value={laptop.model} />
          <SpecRow
            icon={<FaMicrochip />}
            label="Processor"
            value={laptop.processor}
          />
          <SpecRow
            icon={<FaCogs />}
            label="Processor Brand"
            value={laptop.processorBrand}
          />
          <SpecRow icon={<FaMemory />} label="RAM" value={laptop.ram} />
          <SpecRow icon={<FaHdd />} label="Storage" value={laptop.storage} />
          <SpecRow
            icon={<FaBatteryThreeQuarters />}
            label="Battery"
            value={laptop.battery}
          />
          <SpecRow
            icon={<FaRegClock />}
            label="Battery Life"
            value={laptop.batteryLife}
          />
          <SpecRow
            icon={<FaLaptop />}
            label="Screen Size"
            value={laptop.screenSize}
          />
          <SpecRow icon={<FaPalette />} label="Color" value={laptop.colour} />
          <SpecRow
            icon={<FaIndustry />}
            label="Manufacturer"
            value={laptop.manufacturer}
          />
          <SpecRow icon={<FaUsb />} label="USB Ports" value={laptop.usbPorts} />
          <SpecRow
            icon={<FaWeightHanging />}
            label="Weight"
            value={laptop.weight}
          />
          <SpecRow
            icon={<FaHdd />}
            label="Graphics Card"
            value={laptop.graphicsCard}
          />
          <SpecRow
            icon={<FaCogs />}
            label="Graphics Brand"
            value={laptop.graphicBrand}
          />
          <SpecRow
            icon={<FaRegClock />}
            label="Warranty"
            value={`${laptop.warrantyInYear} Year(s)`}
          />
        </div>
      </div>

      {/* SELLER DETAILS */}
      <div className="mt-10 bg-white shadow-md rounded-lg p-6 flex items-center gap-4">
        <div className="bg-blue-100 p-4 rounded-full">
          <FaUser className="text-blue-700 text-3xl" />
        </div>

        <div>
          <h2 className="text-xl font-bold">Seller Information</h2>
          <p>
            <strong>Name:</strong> {sellerName}
          </p>
          <p>
            <strong>Address:</strong> {sellerContact}
          </p>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function SpecRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border-b pb-2">
      <span className="text-blue-600 text-xl">{icon}</span>
      <span className="font-semibold">{label}:</span>
      <span className="ml-auto">{value || "N/A"}</span>
    </div>
  );
}

function SpecIcon({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-3xl text-blue-600">{icon}</span>
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
