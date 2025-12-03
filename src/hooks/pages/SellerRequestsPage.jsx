import React from "react";
import SellerBikeRequests from "../../components/SellerBikeRequests";
import SellerLaptopRequests from "../../components/SellerLaptopRequests";

const SellerRequestsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">Seller Requests</h1>

      <SellerBikeRequests />
      <hr className="my-10" />
      <SellerLaptopRequests />
    </div>
  );
};

export default SellerRequestsPage;
