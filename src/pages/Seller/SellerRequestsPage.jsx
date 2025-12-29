// import React from "react";

// import SellerBikeRequests from "../../components/Bike/SellerBikeRequests";
// import SellerCarRequest from "../../components/Car/seller/SellerCarRequest";
// import SellerLaptopRequests from "../../components/Laptop/SellerLaptopRequests";

// const SellerRequestsPage = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <h1 className="text-2xl font-bold mb-6">Seller Requests</h1>

//       {/* Car Requests */}
//       {/* <SellerCarRequest /> */}
//       <hr className="my-10" />

//       {/* Bike Requests */}
//       <SellerBikeRequests />
//       <hr className="my-10" />

//       {/* Laptop Requests */}
//       {/* <SellerLaptopRequests /> */}
//     </div>
//   );
// };

// export default SellerRequestsPage;



import React, { useState } from "react";

import SellerBikeRequests from "../../components/Bike/SellerBikeRequests";
import SellerCarRequest from "../../components/Car/seller/SellerCarRequest";
import SellerLaptopRequests from "../../components/Laptop/SellerLaptopRequests";

const SellerRequestsPage = () => {
  const [activeProduct, setActiveProduct] = useState("bike");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Seller Requests</h1>

      {/* Product Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeProduct === "car"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveProduct("car")}
        >
          Car
        </button>

        <button
          className={`px-4 py-2 rounded ${
            activeProduct === "bike"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveProduct("bike")}
        >
          Bike
        </button>

        <button
          className={`px-4 py-2 rounded ${
            activeProduct === "laptop"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveProduct("laptop")}
        >
          Laptop
        </button>
      </div>

      {/* Render Request Component Based on Active Product */}
      <div className="mt-4">
        {activeProduct === "car" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Car Requests</h2>
            <SellerCarRequest />
          </>
        )}

        {activeProduct === "bike" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Bike Requests</h2>
            <SellerBikeRequests />
          </>
        )}

        {activeProduct === "laptop" && (
          <>
            <h2 className="text-xl font-semibold mb-4">Laptop Requests</h2>
            <SellerLaptopRequests />
          </>
        )}
      </div>
    </div>
  );
};

export default SellerRequestsPage;
