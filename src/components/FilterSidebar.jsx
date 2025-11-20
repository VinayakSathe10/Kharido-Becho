import React, { useState, useEffect } from 'react';

export default function FilterSidebar({ filters, setFilters, searchResults, onClose }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFeatureChange = (feature) => {
    setFilters(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const resetFilters = () => {
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

  // Popular car brands for quick selection
  const popularBrands = ['Maruti Suzuki', 'Hyundai', 'Honda', 'Tata', 'Toyota', 'Mahindra', 'Ford', 'Renault', 'Kia', 'MG'];
  
  const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
  const transmissions = ['Manual', 'Automatic'];
  const ownerOptions = ['1st', '2nd', '3rd', '4th+'];
  const bodyTypes = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Coupe', 'Convertible'];

  const applyFiltersAndClose = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Mobile overlay component
  if (isMobile && !isExpanded) {
    return (
      <div className="lg:hidden">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full bg-white border border-gray-300 rounded-lg p-4 flex items-center justify-between shadow-sm mb-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <div className="text-left">
              <div className="font-medium text-gray-900">Filters</div>
              <div className="text-sm text-gray-500">{searchResults} cars found</div>
            </div>
          </div>
          <span className="text-gray-400">▼</span>
        </button>
      </div>
    );
  }

  // Main sidebar component
  const sidebarContent = (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${
      isMobile ? 'fixed inset-0 z-50 overflow-y-auto' : 'sticky top-24'
    }`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {searchResults !== undefined && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {searchResults} results
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={() => {
                  setIsExpanded(false);
                  if (onClose) onClose();
                }}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {!isMobile && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
              >
                {isExpanded ? '▲' : '▼'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className={`p-4 space-y-6 ${isMobile ? 'block' : isExpanded ? 'block' : 'hidden lg:block'}`}>
        
        {/* Quick Brand Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Popular Brands</label>
          <div className="flex flex-wrap gap-2">
            {popularBrands.map(brand => (
              <button
                key={brand}
                onClick={() => {
                  setFilters(prev => ({ ...prev, brand }));
                  applyFiltersAndClose();
                }}
                className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                  filters.brand === brand 
                    ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-sm' 
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:border-gray-400'
                } ${isMobile ? 'flex-1 min-w-[45%]' : ''}`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Brand & Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand & Model</label>
          <input
            type="text"
            name="brand"
            value={filters.brand}
            onChange={handleChange}
            placeholder="Search brand or model"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Price Range (₹)</label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                placeholder="Min"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-400 text-lg">-</span>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                placeholder="Max"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Quick Price Buttons */}
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'Under 2L', value: 200000 },
                { label: 'Under 5L', value: 500000 },
                { label: 'Under 10L', value: 1000000 },
                { label: 'Under 20L', value: 2000000 },
                { label: '50L+', value: null }
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => {
                    setFilters(prev => ({ 
                      ...prev, 
                      maxPrice: value || '',
                      minPrice: prev.minPrice || ''
                    }));
                    applyFiltersAndClose();
                  }}
                  className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition flex-1 text-center min-w-[100px]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Year Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Manufacturing Year</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              name="minYear"
              value={filters.minYear}
              onChange={handleChange}
              placeholder="From"
              min="1990"
              max={new Date().getFullYear()}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-400 text-lg">-</span>
            <input
              type="number"
              name="maxYear"
              value={filters.maxYear}
              onChange={handleChange}
              placeholder="To"
              min="1990"
              max={new Date().getFullYear()}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* KM Driven */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">KM Driven</label>
          <input
            type="number"
            name="kmDriven"
            value={filters.kmDriven}
            onChange={handleChange}
            placeholder="Maximum KM driven"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {/* Quick KM Buttons */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {[
              { label: 'Under 10k', value: 10000 },
              { label: 'Under 30k', value: 30000 },
              { label: 'Under 50k', value: 50000 },
              { label: 'Under 80k', value: 80000 },
              { label: '1L+', value: null }
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => {
                  setFilters(prev => ({ ...prev, kmDriven: value || '' }));
                  applyFiltersAndClose();
                }}
                className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition flex-1 text-center min-w-[80px]"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Fuel Type & Transmission - Side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
            <select
              name="fuelType"
              value={filters.fuelType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Fuel Types</option>
              {fuelTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
            <select
              name="transmission"
              value={filters.transmission}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Transmissions</option>
              {transmissions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Body Type & Owners - Side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
            <select
              name="bodyType"
              value={filters.bodyType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Body Types</option>
              {bodyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Owners</label>
            <select
              name="owners"
              value={filters.owners}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Owner</option>
              {ownerOptions.map(owner => (
                <option key={owner} value={owner}>{owner} Owner</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="City, State"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Key Features</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(filters.features || {}).map(([feature, checked]) => (
              <label key={feature} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleFeatureChange(feature)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200 mt-6">
          <button
            onClick={resetFilters}
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-lg hover:bg-gray-200 transition font-medium border border-gray-300 text-base"
          >
            Reset All Filters
          </button>
          {isMobile && (
            <button
              onClick={applyFiltersAndClose}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-medium text-base shadow-sm"
            >
              Show {searchResults} Results
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render with overlay for mobile
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsExpanded(false)} />
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white overflow-y-auto">
          {sidebarContent}
        </div>
      </div>
    );
  }

  // Desktop rendering
  return sidebarContent;
}