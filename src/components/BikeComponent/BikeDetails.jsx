// src/pages/bikes/BikeDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getBikeById } from "../../store/services/bikeServices";
import { createBikeBooking, sendBikeBookingMessage } from "../../store/services/bikeBookingServices";

import {
  FaMapMarkerAlt,
  FaMotorcycle,
  FaTachometerAlt,
  FaGasPump,
  FaRegCalendarAlt,
} from "react-icons/fa";

export default function BikeDetail() {
  const { id } = useParams();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadBike();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadBike = async () => {
    setLoading(true);
    try {
      const data = await getBikeById(id);
      console.log("🔥 Bike detail API response:", data);
      setBike(data);
    } catch (err) {
      toast.error("Failed to load bike details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = async () => {
    const buyerId = localStorage.getItem("buyerId");
    if (!buyerId) {
      toast.error("Please login as buyer");
      return;
    }

    const bikeId = Number(id);
    const message = "Hi, I am interested in this bike.";

    try {
      setRequesting(true);
      const booking = await createBikeBooking(bikeId, Number(buyerId), message);
      const bookingId = booking.bookingId;
      localStorage.setItem("bikeBookingId", bookingId);

      await sendBikeBookingMessage(bookingId, bikeId, Number(buyerId), message);

      toast.success("Request Sent & Message Delivered!");
      setIsBooked(true);

      navigate(`/chat?bookingId=${bookingId}&bike=${bikeId}&seller=${bike.sellerId}`);
    } catch (error) {
      if (error.response?.data?.message?.includes("already created")) {
        setIsBooked(true);
        const existing = localStorage.getItem("bikeBookingId");
        navigate(`/chat?bookingId=${existing}&bike=${bikeId}&seller=${bike.sellerId}`);
      } else {
        toast.error(error.response?.data?.message || "Booking failed");
      }
    } finally {
      setRequesting(false);
    }
  };

  const handleChatWithSeller = () => {
    const bookingId = localStorage.getItem("bikeBookingId");
    const bikeId = Number(id);
    if (!bookingId) {
      toast.error("Please make booking first");
      return;
    }
    navigate(`/chat?bookingId=${bookingId}&bike=${bikeId}&seller=${bike.sellerId}`);
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!bike) return <p className="p-4">Bike not found.</p>;

  const photos = bike.bikePhotos || bike.images || [];
  const price = bike.prize ?? bike.price ?? 0;

  const status = (bike.status || "").toUpperCase();
  const isPending = status === "PENDING";
  const isSold = status === "SOLD";

  const disabled = requesting || isPending || isSold || isBooked;

  const buttonLabel = isSold
    ? "Sold"
    : isPending
    ? "Pending"
    : isBooked
    ? "Request Sent"
    : requesting
    ? "Sending..."
    : "Send Request to Seller";

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:underline">Home</Link> /
        <Link to="/buy/bikes" className="hover:underline ml-1">Bikes</Link> /
        <span className="ml-1 font-semibold text-gray-900">
          {bike.brand} {bike.model} {bike.variant && `(${bike.variant})`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <img
            src={
              photos.length > 0
                ? photos[0].image_link || photos[0].photo_link
                : "https://via.placeholder.com/350x230?text=No+Image"
            }
            alt={bike.model}
            className="w-full rounded-lg shadow-lg object-cover h-80 md:h-[420px] transition-transform duration-300 hover:scale-[1.02]"
          />
          {photos.length > 1 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {photos.slice(1).map((p, i) => (
                <img
                  key={i}
                  src={p.image_link || p.photo_link}
                  alt={`Bike ${i + 1}`}
                  className="w-full h-28 object-cover rounded-md shadow hover:scale-105 transition"
                />
              ))}
            </div>
          )}
        </div>

        {/* Details & Actions */}
        <div>
          <h1 className="text-4xl font-bold mb-2 flex gap-2 items-center">
            <FaMotorcycle className="text-blue-600" /> {bike.brand} {bike.model}
          </h1>
          {bike.variant && <p className="text-lg text-gray-600 mb-1">{bike.variant}</p>}
          <p className="text-3xl font-bold text-green-700 mb-4">₹ {price}</p>

          <div className="flex flex-wrap gap-5 bg-blue-50 p-4 rounded-xl shadow mb-6">
            <SpecBox icon={<FaRegCalendarAlt />} value={bike.manufactureYear} label="Year" />
            <SpecBox icon={<FaTachometerAlt />} value={`${bike.kilometersDriven} km`} label="Driven" />
            <SpecBox icon={<FaGasPump />} value={bike.fuelType} label="Fuel" />
          </div>

          <p className="flex items-center text-gray-700 mb-2">
            <FaMapMarkerAlt className="mr-2 text-blue-600" /> {bike.location || "N/A"}
          </p>

          <p className="text-gray-700 mb-2"><b>Color:</b> {bike.color}</p>
          <p className="text-gray-700 mb-2"><b>Reg No:</b> {bike.registrationNumber}</p>
          <p className="text-gray-700 mb-6"><b>Status:</b> {bike.status}</p>

          <button
            disabled={disabled}
            onClick={handleMakeOffer}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full text-lg shadow-lg disabled:opacity-60"
          >
            {buttonLabel}
          </button>

          <button
            onClick={handleChatWithSeller}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg w-full text-lg shadow-lg mt-3"
          >
            Chat Seller
          </button>
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-12 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Specifications</h2>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <Spec label="Brand" value={bike.brand} />
          <Spec label="Model" value={bike.model} />
          <Spec label="Variant" value={bike.variant || "N/A"} />
          <Spec label="Manufacture Year" value={bike.manufactureYear} />
          <Spec label="Engine" value={`${bike.engineCC} cc`} />
          <Spec label="Driven" value={`${bike.kilometersDriven} km`} />
          <Spec label="Fuel Type" value={bike.fuelType} />
          <Spec label="Color" value={bike.color} />
          <Spec label="Registration Number" value={bike.registrationNumber} />
          <Spec label="Status" value={bike.status} />
        </div>
      </div>

      {/* Description */}
      <div className="mt-10 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-3">Description</h2>
        <p className="text-gray-700 leading-relaxed">{bike.description || "No description provided."}</p>
      </div>

      {/* Mobile Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-between items-center md:hidden">
        <p className="text-xl font-bold text-green-700">₹ {price}</p>
        <button
          disabled={disabled}
          onClick={handleMakeOffer}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-60"
        >
          {buttonLabel}
        </button>
        <button
          onClick={handleChatWithSeller}
          className="bg-green-600 text-white px-6 py-2 rounded-lg ml-2"
        >
          Chat
        </button>
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <p className="flex justify-between border-b py-2">
      <b>{label}</b> <span>{value}</span>
    </p>
  );
}

function SpecBox({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-blue-600 text-2xl">{icon}</p>
      <p className="font-semibold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}





// // src/pages/bikes/BikeDetail.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";

// // Import your services — ensure correct import paths
// import { getBikeById } from "../../store/services/bikeServices";
// import { createBikeBooking, sendBikeBookingMessage } from "../../store/services/bikeBookingServices";

// import {
//   FaMapMarkerAlt,
//   FaMotorcycle,
//   FaTachometerAlt,
//   FaGasPump,
//   FaRegCalendarAlt,
// } from "react-icons/fa";

// export default function BikeDetail() {
//   const { id } = useParams();
//   const [bike, setBike] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [requesting, setRequesting] = useState(false);
//   const [isBooked, setIsBooked] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     loadBike();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const loadBike = async () => {
//     setLoading(true);
//     try {
//       const data = await getBikeById(id);
//       setBike(data);
//     } catch (err) {
//       toast.error("Failed to load bike details");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMakeOffer = async () => {
//     const buyerId = localStorage.getItem("buyerId");
//     if (!buyerId) {
//       toast.error("Please login as buyer");
//       return;
//     }

//     const bikeId = Number(id);
//     const message = "Hi, I am interested in this bike.";

//     try {
//       setRequesting(true);

//       const booking = await createBikeBooking(bikeId, Number(buyerId), message);
//       const bookingId = booking.bookingId;

//       localStorage.setItem("bikeBookingId", bookingId);

//       await sendBikeBookingMessage(bookingId, bikeId, Number(buyerId), message);

//       toast.success("Request Sent & Message Delivered!");
//       setIsBooked(true);

//       navigate(`/chat?bookingId=${bookingId}&bike=${bikeId}&seller=${bike.sellerId}`);
//     } catch (error) {
//       if (error.response?.data?.message?.includes("already created")) {
//         setIsBooked(true);
//         const existing = localStorage.getItem("bikeBookingId");
//         navigate(`/chat?bookingId=${existing}&bike=${bikeId}&seller=${bike.sellerId}`);
//       } else {
//         toast.error(error.response?.data?.message || "Booking failed");
//       }
//     } finally {
//       setRequesting(false);
//     }
//   };

//   const handleChatWithSeller = () => {
//     const bookingId = localStorage.getItem("bikeBookingId");
//     const bikeId = Number(id);

//     if (!bookingId) {
//       toast.error("Please make booking first");
//       return;
//     }

//     navigate(`/chat?bookingId=${bookingId}&bike=${bikeId}&seller=${bike.sellerId}`);
//   };

//   if (loading) return <p className="p-4">Loading...</p>;
//   if (!bike) return <p className="p-4">Bike not found.</p>;

//   const photos = bike.bikePhotos || bike.images || [];
//   const price = bike.prize ?? bike.price ?? 0;

//   const status = (bike.status || "").toUpperCase();
//   const isPending = status === "PENDING";
//   const isSold = status === "SOLD";
//   const disabled = requesting || isPending || isSold || isBooked;

//   const buttonLabel = isSold
//     ? "Sold"
//     : isPending
//     ? "Pending"
//     : isBooked
//     ? "Request Sent"
//     : requesting
//     ? "Sending..."
//     : "Send Request to Seller";

//   return (
//     <div className="container mx-auto px-4 py-6 pb-24">
//       <div className="text-sm text-gray-600 mb-4">
//         <Link to="/" className="hover:underline">Home</Link> /
//         <Link to="/buy/bikes" className="hover:underline ml-1">Bikes</Link> /
//         <span className="ml-1 font-semibold text-gray-900">
//           {bike.brand} {bike.model} {bike.variant && `(${bike.variant})`}
//         </span>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//         <div>
//           <img
//             src={photos.length > 0 ? (photos[0].image_link || photos[0].photo_link) : "https://via.placeholder.com/350x230?text=No+Image"}
//             alt={bike.model}
//             className="w-full rounded-lg shadow-lg object-cover h-80 md:h-[420px] transition-transform duration-300 hover:scale-[1.02]"
//           />
//           {photos.length > 1 && (
//             <div className="grid grid-cols-3 gap-4 mt-4">
//               {photos.slice(1).map((p, i) => (
//                 <img
//                   key={i}
//                   src={p.image_link || p.photo_link}
//                   alt={`Bike ${i + 1}`}
//                   className="w-full h-28 object-cover rounded-md shadow hover:scale-105 transition"
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         <div>
//           <h1 className="text-4xl font-bold mb-2 flex gap-2 items-center">
//             <FaMotorcycle className="text-blue-600" /> {bike.brand} {bike.model}
//           </h1>
//           {bike.variant && <p className="text-lg text-gray-600 mb-1">{bike.variant}</p>}
//           <p className="text-3xl font-bold text-green-700 mb-4">₹ {price}</p>

//           <div className="flex flex-wrap gap-5 bg-blue-50 p-4 rounded-xl shadow mb-6">
//             <SpecBox icon={<FaRegCalendarAlt />} value={bike.manufactureYear} label="Year" />
//             <SpecBox icon={<FaTachometerAlt />} value={`${bike.kilometersDriven} km`} label="Driven" />
//             <SpecBox icon={<FaGasPump />} value={bike.fuelType} label="Fuel" />
//           </div>

//           <p className="flex items-center text-gray-700 mb-2">
//             <FaMapMarkerAlt className="mr-2 text-blue-600" /> {bike.location || "N/A"}
//           </p>

//           <p className="text-gray-700 mb-2"><b>Color:</b> {bike.color}</p>
//           <p className="text-gray-700 mb-2"><b>Reg No:</b> {bike.registrationNumber}</p>
//           <p className="text-gray-700 mb-6">
//   <b>Status:</b> {bike.status}
// </p>


//           <button disabled={disabled} onClick={handleMakeOffer} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full text-lg shadow-lg disabled:opacity-60">
//             {buttonLabel}
//           </button>

//           <button onClick={handleChatWithSeller} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg w-full text-lg shadow-lg mt-3">
//             Chat Seller
//           </button>
//         </div>
//       </div>

//       {/* You can optionally include specs / description / additional UI here */}
//     </div>
//   );
// }

// function Spec({ label, value }) {
//   return (
//     <p className="flex justify-between border-b py-2">
//       <b>{label}</b> <span>{value}</span>
//     </p>
//   );
// }

// function SpecBox({ icon, value, label }) {
//   return (
//     <div className="flex flex-col items-center">
//       <p className="text-blue-600 text-2xl">{icon}</p>
//       <p className="font-semibold">{value}</p>
//       <p className="text-xs text-gray-500">{label}</p>
//     </div>
//   );
// }
