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


import React, { useState, useEffect } from 'react';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ ProductCard';

export default function BuyCars() {
  // state for filter values
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    kmDriven: '',
    location: '',
    fuelType: '',
    transmission: '',
    owners: '',
    bodyType: '',
    features: {
      ac: false,
      powerWindows: false,
      powerSteering: false,
      abs: false,
      airbags: false,
      musicSystem: false
    }
  });
  
  const [sortBy, setSortBy] = useState('datePublished');  // default sort
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sample data with more detailed information
  const sampleProducts = [
    {
      id: 1,
      image: '/images/car-sample1.jpg',
      title: '2016 Mercedes-Benz C-Class',
      subtitle: '2016 · 68,000 km · Petrol · Automatic',
      price: '₹19,45,000',
      originalPrice: 1945000,
      location: 'DLF City, Gurgaon',
      date: 'Oct 31',
      featured: true,
      brand: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2016,
      kmDriven: 68000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      owners: '2nd',
      bodyType: 'Sedan',
      features: ['ac', 'powerWindows', 'powerSteering', 'abs', 'airbags', 'musicSystem']
    },
    {
      id: 2,
      image: '/images/car-sample2.jpg',
      title: 'Maruti Suzuki Brezza',
      subtitle: '2024 · 5,500 km · Petrol · Manual',
      price: '₹11,50,000',
      originalPrice: 1150000,
      location: 'Kuttukuzhi, Kerala',
      date: 'Oct 12',
      featured: true,
      brand: 'Maruti Suzuki',
      model: 'Brezza',
      year: 2024,
      kmDriven: 5500,
      fuelType: 'Petrol',
      transmission: 'Manual',
      owners: '1st',
      bodyType: 'SUV',
      features: ['ac', 'powerWindows', 'powerSteering', 'abs']
    },
    {
      id: 3,
      image: '/images/car-sample3.jpg',
      title: 'BMW 3 Series',
      subtitle: '2012 · 31,000 km · Diesel · Automatic',
      price: '₹25,50,000',
      originalPrice: 2550000,
      location: 'Karunagappally, Kerala',
      date: 'Oct 28',
      featured: true,
      brand: 'BMW',
      model: '3 Series',
      year: 2012,
      kmDriven: 31000,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      owners: '3rd',
      bodyType: 'Sedan',
      features: ['ac', 'powerWindows', 'abs', 'airbags', 'musicSystem']
    },
    {
      id: 4,
      image: '/images/car-sample4.jpg',
      title: 'Hyundai Creta',
      subtitle: '2021 · 25,000 km · Diesel · Automatic',
      price: '₹14,75,000',
      originalPrice: 1475000,
      location: 'Bangalore, Karnataka',
      date: 'Nov 1',
      featured: false,
      brand: 'Hyundai',
      model: 'Creta',
      year: 2021,
      kmDriven: 25000,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      owners: '1st',
      bodyType: 'SUV',
      features: ['ac', 'powerWindows', 'powerSteering', 'abs', 'airbags']
    },
    {
      id: 5,
      image: '/images/car-sample5.jpg',
      title: 'Tata Nexon',
      subtitle: '2022 · 15,000 km · Petrol · Manual',
      price: '₹8,90,000',
      originalPrice: 890000,
      location: 'Mumbai, Maharashtra',
      date: 'Oct 25',
      featured: false,
      brand: 'Tata',
      model: 'Nexon',
      year: 2022,
      kmDriven: 15000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      owners: '1st',
      bodyType: 'SUV',
      features: ['ac', 'powerWindows', 'powerSteering', 'abs']
    },
    {
      id: 6,
      image: '/images/car-sample6.jpg',
      title: 'Honda City',
      subtitle: '2019 · 40,000 km · Petrol · Manual',
      price: '₹9,25,000',
      originalPrice: 925000,
      location: 'Chennai, Tamil Nadu',
      date: 'Oct 20',
      featured: false,
      brand: 'Honda',
      model: 'City',
      year: 2019,
      kmDriven: 40000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      owners: '2nd',
      bodyType: 'Sedan',
      features: ['ac', 'powerWindows', 'powerSteering']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    const timer = setTimeout(() => {
      setProducts(sampleProducts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter products based on filters
  useEffect(() => {
    if (products.length === 0) return;

    let filtered = products.filter(product => {
      // Brand filter
      if (filters.brand && !product.brand.toLowerCase().includes(filters.brand.toLowerCase())) {
        return false;
      }

      // Model filter
      if (filters.model && !product.model.toLowerCase().includes(filters.model.toLowerCase())) {
        return false;
      }

      // Price range filter
      if (filters.minPrice && product.originalPrice < parseInt(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && product.originalPrice > parseInt(filters.maxPrice)) {
        return false;
      }

      // Year range filter
      if (filters.minYear && product.year < parseInt(filters.minYear)) {
        return false;
      }
      if (filters.maxYear && product.year > parseInt(filters.maxYear)) {
        return false;
      }

      // KM driven filter
      if (filters.kmDriven && product.kmDriven > parseInt(filters.kmDriven)) {
        return false;
      }

      // Location filter
      if (filters.location && !product.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Fuel type filter
      if (filters.fuelType && product.fuelType !== filters.fuelType) {
        return false;
      }

      // Transmission filter
      if (filters.transmission && product.transmission !== filters.transmission) {
        return false;
      }

      // Body type filter
      if (filters.bodyType && product.bodyType !== filters.bodyType) {
        return false;
      }

      // Owners filter
      if (filters.owners && product.owners !== filters.owners) {
        return false;
      }

      // Features filter
      if (filters.features) {
        const requiredFeatures = Object.entries(filters.features)
          .filter(([_, checked]) => checked)
          .map(([feature]) => feature);
        
        if (requiredFeatures.length > 0) {
          const hasAllFeatures = requiredFeatures.every(feature => 
            product.features.includes(feature)
          );
          if (!hasAllFeatures) return false;
        }
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priceLowHigh':
          return a.originalPrice - b.originalPrice;
        case 'priceHighLow':
          return b.originalPrice - a.originalPrice;
        case 'yearNewOld':
          return b.year - a.year;
        case 'yearOldNew':
          return a.year - b.year;
        case 'kmLowHigh':
          return a.kmDriven - b.kmDriven;
        case 'kmHighLow':
          return b.kmDriven - a.kmDriven;
        case 'datePublished':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    setFilteredProducts(filtered);
  }, [products, filters, sortBy]);

  const clearAllFilters = () => {
    setFilters({
      brand: '',
      model: '',
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
      kmDriven: '',
      location: '',
      fuelType: '',
      transmission: '',
      owners: '',
      bodyType: '',
      features: {
        ac: false,
        powerWindows: false,
        powerSteering: false,
        abs: false,
        airbags: false,
        musicSystem: false
      }
    });
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => {
      if (typeof value === 'object') {
        return Object.values(value).some(v => v);
      }
      return value !== '';
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="w-full bg-white border border-gray-300 rounded-lg py-3 px-4 flex items-center justify-between shadow-sm"
          >
            <span className="font-medium text-gray-700">Filters & Sort</span>
            <span className="text-gray-500">
              {hasActiveFilters() && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">
                  !
                </span>
              )}
              ⚙️
            </span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters - Desktop */}
          <aside className="w-full lg:w-80 hidden lg:block">
            <FilterSidebar 
              filters={filters} 
              setFilters={setFilters} 
              searchResults={filteredProducts.length}
            />
          </aside>

          {/* Mobile Filter Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar 
                    filters={filters} 
                    setFilters={setFilters} 
                    searchResults={filteredProducts.length}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main listing/ results section */}
          <main className="flex-1">
            <header className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Cars in India</h2>
                  <p className="text-gray-600 mt-1">
                    {loading ? 'Loading...' : `${filteredProducts.length} cars found`}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Active Filters Indicator */}
                  {hasActiveFilters() && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 font-medium">SORT BY:</label>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="datePublished">Date Published</option>
                      <option value="priceLowHigh">Price: Low to High</option>
                      <option value="priceHighLow">Price: High to Low</option>
                      <option value="yearNewOld">Year: Newest First</option>
                      <option value="yearOldNew">Year: Oldest First</option>
                      <option value="kmLowHigh">KM: Low to High</option>
                      <option value="kmHighLow">KM: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </header>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                    <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-3 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* No Results State */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🚗</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No cars found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters to find more results.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  /* Products Grid */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Load More Button */}
            {!loading && filteredProducts.length > 0 && (
              <div className="text-center mt-8">
                <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
                  Load More Cars
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}