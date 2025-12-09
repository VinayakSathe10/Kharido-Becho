// import React, { useState, useEffect } from 'react';
// import FilterSidebar from '../components/FilterSidebar';
// import ProductCard from '../components/ ProductCard';

// export default function BuyCars() {
//   // state for filter values
//   const [filters, setFilters] = useState({
//     brand: '',
//     model: '',
//     minPrice: '',
//     maxPrice: '',
//     year: '',
//     kmDriven: '',
//     location: ''
//   });
//   const [sortBy, setSortBy] = useState('datePublished');  // default sort
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     // TODO: fetch product list based on filters & sortBy
//     // Example: api.getCars({ filters, sortBy }).then(setProducts)
//     // For now use dummy data
//     const dummy = [
//       {
//         id: 1,
//         image: '/images/car-sample1.jpg',
//         title: '2016 Mercedes-Benz C-Class',
//         subtitle: '2016 · 68,000 km',
//         price: '₹19,45,000',
//         location: 'DLF City',
//         date: 'Oct 31',
//         featured: true
//       },
//       {
//         id: 2,
//         image: '/images/car-sample2.jpg',
//         title: 'Maruti Suzuki Brezza',
//         subtitle: '2024 · 5,500 km',
//         price: '₹11,50,000',
//         location: 'Kuttukuzhi',
//         date: 'Oct 12',
//         featured: true
//       },
//       {
//         id: 3,
//         image: '/images/car-sample3.jpg',
//         title: 'BMW 3 Series',
//         subtitle: '2012 · 31,000 km',
//         price: '₹25,50,000',
//         location: 'Karunagappally',
//         date: 'Oct 28',
//         featured: true
//       }
//       // ... more
//     ];
//     setProducts(dummy);
//   }, [filters, sortBy]);

//   return (
//     <div className="container mx-auto px-4 py-8 flex space-x-6">
//       {/* Sidebar filters */}
//       <aside className="w-64 hidden lg:block">
//         <FilterSidebar filters={filters} setFilters={setFilters} />
//       </aside>

//       {/* Main listing/ results section */}
//       <main className="flex-1">
//         <header className="mb-4 flex items-center justify-space-between">
//           <h2 className="text-2xl font-bold">Cars in India</h2>
//           <div className="ml-auto">
//             <label className="text-sm text-gray-600 mr-2">SORT BY:</label>
//             <select
//               value={sortBy}
//               onChange={e => setSortBy(e.target.value)}
//               className="border rounded-md py-1 px-2 text-sm"
//             >
//               <option value="datePublished">Date Published</option>
//               <option value="priceLowHigh">Price: Low to High</option>
//               <option value="priceHighLow">Price: High to Low</option>
//             </select>
//           </div>
//         </header>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map(prod => (
//             <ProductCard key={prod.id} product={prod} />
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { getAllCars } from "../../store/services/carServices";

export default function BuyCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);

      const data = await getAllCars(0, 100); // Fetch 100 cars
      setCars(data);
    } catch (err) {
      console.error("Failed to load cars", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* TITLE */}
      <h2 className="text-3xl font-bold mb-2">Browse Cars</h2>
      <p className="text-gray-600 mb-6">
        Find your perfect car from our wide range of listings.
      </p>

      {loading ? (
        <p className="text-gray-700 text-lg">Loading cars...</p>
      ) : cars.length === 0 ? (
        <p className="text-gray-600">No cars available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car.carId} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------
                  CAR CARD COMPONENT
----------------------------------------------------- */

// function CarCard({ car }) {
//   const imageUrl =
//     car.images?.[0]?.imageUrl ||
//     "https://via.placeholder.com/350x230?text=No+Image";

//   return (
//     <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-3">
//       {/* IMAGE */}
//       <div className="w-full h-44 rounded-md overflow-hidden">
//         <img
//           src={imageUrl}
//           alt={car.title}
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* DETAILS */}
//       <div className="mt-3 space-y-1">
//         <h3 className="text-lg font-semibold">
//           {car.brand} {car.model}
//         </h3>

//         {car.variant && <p className="text-gray-600 text-sm">{car.variant}</p>}

//         <p className="text-gray-600 text-sm">
//           {car.yearOfPurchase ? `${car.yearOfPurchase}` : "Year N/A"} •{" "}
//           {car.fuelType}
//         </p>

//         <p className="text-green-600 font-bold text-lg">
//           ₹ {Number(car.price).toLocaleString()}
//         </p>
//       </div>

//       {/* BUTTON */}
//       <button
//         className="w-full mt-3 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
//         onClick={() => alert("Car details page coming soon")}
//       >
//         View Details
//       </button>
//     </div>
//   );
// }
function CarCard({ car }) {
  const imageUrl =
    Array.isArray(car.images) && car.images.length > 0
      ? car.images[0]
      : "https://via.placeholder.com/350x230?text=No+Image";

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-3">
      <div className="w-full h-44 rounded-md overflow-hidden">
        <img
          src={imageUrl}
          alt={car.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-lg font-semibold">
          {car.brand} {car.model}
        </h3>

        {car.variant && <p className="text-gray-600 text-sm">{car.variant}</p>}

        <p className="text-gray-600 text-sm">
          {car.yearOfPurchase} • {car.fuelType}
        </p>

        <p className="text-green-600 font-bold text-lg">
          ₹ {Number(car.price).toLocaleString()}
        </p>
      </div>

      <button className="w-full mt-3 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">
        View Details
      </button>
    </div>
  );
}
