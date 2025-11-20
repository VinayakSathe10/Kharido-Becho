import React, { useState } from 'react';
import { useAddBikeMutation } from '../store/services/sellerApi';

const initialForm = {
  bike_id: '',
  prize: '',
  brand: '',
  model: '',
  variant: '',
  manufactureYear: '',
  engineCC: '',
  kilometersDriven: '',
  fuelType: 'PETROL',
  color: '',
  registrationNumber: '',
  description: '',
  sellerId: 1,
  status: 'AVAILABLE',
};

export default function SellBikeForm() {
  const [form, setForm] = useState(initialForm);
  const [addBike, { isLoading }] = useAddBikeMutation();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: [
        'bike_id',
        'prize',
        'manufactureYear',
        'engineCC',
        'kilometersDriven',
        'sellerId',
      ].includes(field)
        ? Number(value || 0)
        : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const data = await addBike({
        ...form,
        prize: Number(form.prize || 0),
      }).unwrap();
      setMessage(data?.message || 'Bike added successfully');
      setForm(initialForm);
    } catch (err) {
      const apiMessage = err?.data?.message || err?.message || 'Something went wrong';
      setError(apiMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Bike ID"
          type="number"
          value={form.bike_id}
          onChange={e => handleChange('bike_id', e.target.value)}
        />
        <Input
          label="Prize (₹)"
          type="number"
          value={form.prize}
          onChange={e => handleChange('prize', e.target.value)}
          required
        />
        <Input
          label="Brand"
          value={form.brand}
          onChange={e => handleChange('brand', e.target.value)}
          required
        />
        <Input
          label="Model"
          value={form.model}
          onChange={e => handleChange('model', e.target.value)}
          required
        />
        <Input
          label="Variant"
          value={form.variant}
          onChange={e => handleChange('variant', e.target.value)}
        />
        <Input
          label="Manufacture Year"
          type="number"
          value={form.manufactureYear}
          onChange={e => handleChange('manufactureYear', e.target.value)}
        />
        <Input
          label="Engine CC"
          type="number"
          value={form.engineCC}
          onChange={e => handleChange('engineCC', e.target.value)}
        />
        <Input
          label="Kilometers Driven"
          type="number"
          value={form.kilometersDriven}
          onChange={e => handleChange('kilometersDriven', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-sm">Fuel Type</label>
          <select
            value={form.fuelType}
            onChange={e => handleChange('fuelType', e.target.value)}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="PETROL">PETROL</option>
            <option value="DIESEL">DIESEL</option>
            <option value="CNG">CNG</option>
            <option value="ELECTRIC">ELECTRIC</option>
          </select>
        </div>
        <Input
          label="Color"
          value={form.color}
          onChange={e => handleChange('color', e.target.value)}
        />
        <Input
          label="Registration Number"
          value={form.registrationNumber}
          onChange={e => handleChange('registrationNumber', e.target.value)}
        />
        <div>
          <label className="block mb-1 font-medium text-sm">Status</label>
          <select
            value={form.status}
            onChange={e => handleChange('status', e.target.value)}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="DELETED">DELETED</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium text-sm">Description</label>
        <textarea
          value={form.description}
          onChange={e => handleChange('description', e.target.value)}
          className="w-full border rounded-md p-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Describe the bike condition, features..."
        />
      </div>

      <div className="flex gap-3 items-center">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Submitting…' : 'Add Bike'}
        </button>
        {message && <p className="text-sm text-green-600">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </form>
  );
}

function Input({ label, type = 'text', ...props }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-sm">{label}</label>
      <input
        type={type}
        {...props}
        className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
