// src/components/CategoriesDropdown.jsx
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CategoriesDropdown({ visible, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    }
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div ref={ref} className="absolute top-full left-0 w-screen bg-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Vehicles</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            <li><Link to="/buy?category=vehicles&sub=cars" className="hover:text-blue-600">Cars</Link></li>
            <li><Link to="/buy?category=vehicles&sub=bikes" className="hover:text-blue-600">Bikes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Electronics</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            <li><Link to="/buy?category=electronics&sub=mobiles" className="hover:text-blue-600">Mobiles</Link></li>
            <li><Link to="/buy?category=electronics&sub=laptops" className="hover:text-blue-600">Laptops</Link></li>
          </ul>
        </div>
        <div /><div />
      </div>
    </div>
  );
}
