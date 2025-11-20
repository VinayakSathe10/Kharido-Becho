import { useState } from 'react';
import SellLaptopForm from '../components/SellLaptopForm';
import SellBikeForm from '../components/SellBikeForm';

export default function SellProducts() {
  const [activeTab, setActiveTab] = useState('laptop');

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Sell Your Product</h2>

      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm overflow-hidden border">
          <button
            type="button"
            onClick={() => setActiveTab('laptop')}
            className={`px-6 py-2 text-sm font-medium ${
              activeTab === 'laptop' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Laptop
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bike')}
            className={`px-6 py-2 text-sm font-medium border-l ${
              activeTab === 'bike' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            Bike
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        {activeTab === 'laptop' ? <SellLaptopForm /> : <SellBikeForm />}
      </div>
    </div>
  );
}

