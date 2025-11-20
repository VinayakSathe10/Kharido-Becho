// import React, { useState } from 'react';
// const API_BASE = 'http://localhost:8087';

// export default function SellLaptopForm() {
//   const initialForm = {
//     serialNumber: '',
//     dealer: '',
//     model: '',
//     brand: '',
//     price: '',
//     warrantyInYear: 1,
//     processor: '',
//     processorBrand: '',
//     memoryType: '',
//     screenSize: '',
//     colour: '',
//     ram: '',
//     storage: '',
//     battery: '',
//     batteryLife: '',
//     graphicsCard: '',
//     graphicBrand: '',
//     weight: '',           // keep as string until submission
//     manufacturer: '',
//     usbPorts: 2,
//     status: 'ACTIVE',
//     sellerId: 1,
//   };

//   const [form, setForm] = useState(initialForm);
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleChange = (field, value) => {
//     if (field === 'weight') {
//       // keep as string for validation later
//       setForm(prev => ({
//         ...prev,
//         [field]: value,
//       }));
//     } else if (
//       field === 'price' ||
//       field === 'warrantyInYear' ||
//       field === 'usbPorts' ||
//       field === 'sellerId'
//     ) {
//       setForm(prev => ({
//         ...prev,
//         [field]: Number(value || 0),
//       }));
//     } else {
//       setForm(prev => ({
//         ...prev,
//         [field]: value,
//       }));
//     }
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setSubmitting(true);
//     setMessage('');
//     setError('');

//     // serial number validation: letters, digits, hyphens only
//     const serialRegex = /^[A-Za-z0-9\-]+$/;
//     if (!serialRegex.test(form.serialNumber)) {
//       setError("Serial Number may contain only letters, digits or hyphens");
//       setSubmitting(false);
//       return;
//     }

//     // weight validation
//     const weightNum = Number(form.weight);
//     console.log("weight is ",weightNum);
//     if (form.weight === '' || isNaN(weightNum) || weightNum <= 0) {
//       setError("Weight must be a number greater than zero");
//       setSubmitting(false);
//       return;
//     }

//     // build payload
//     const payload = {
//       ...form,
//       price: Number(form.price || 0),
//       weight: weightNum,
//     };

//     try {
//       const res = await fetch(`${API_BASE}/api/laptops/create`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         throw new Error(data?.message || 'Failed to add laptop');
//       }
//       setMessage(data?.message || 'Laptop added successfully');
//       setForm(initialForm);  // reset form to initial state
//     } catch (err) {
//       setError(err.message || 'Something went wrong');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4" noValidate>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Input
//           label="Serial Number"
//           value={form.serialNumber}
//           onChange={e => handleChange('serialNumber', e.target.value)}
//           required
//         />
//         <Input
//           label="Dealer"
//           value={form.dealer}
//           onChange={e => handleChange('dealer', e.target.value)}
//           required
//         />
//         <Input
//           label="Model"
//           value={form.model}
//           onChange={e => handleChange('model', e.target.value)}
//           required
//         />
//         <Input
//           label="Brand"
//           value={form.brand}
//           onChange={e => handleChange('brand', e.target.value)}
//           required
//         />
//         <Input
//           label="Price (₹)"
//           type="number"
//           value={form.price}
//           onChange={e => handleChange('price', e.target.value)}
//           required
//         />
//         <Input
//           label="Warranty (Years)"
//           type="number"
//           value={form.warrantyInYear}
//           onChange={e => handleChange('warrantyInYear', e.target.value)}
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Input
//           label="Processor"
//           value={form.processor}
//           onChange={e => handleChange('processor', e.target.value)}
//         />
//         <Input
//           label="Processor Brand"
//           value={form.processorBrand}
//           onChange={e => handleChange('processorBrand', e.target.value)}
//         />
//         <Input
//           label="Memory Type"
//           value={form.memoryType}
//           onChange={e => handleChange('memoryType', e.target.value)}
//         />
//         <Input
//           label="Screen Size"
//           value={form.screenSize}
//           onChange={e => handleChange('screenSize', e.target.value)}
//         />
//         <Input
//           label="Colour"
//           value={form.colour}
//           onChange={e => handleChange('colour', e.target.value)}
//         />
//         <Input
//           label="RAM"
//           value={form.ram}
//           onChange={e => handleChange('ram', e.target.value)}
//         />
//         <Input
//           label="Storage"
//           value={form.storage}
//           onChange={e => handleChange('storage', e.target.value)}
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Input
//           label="Battery"
//           value={form.battery}
//           onChange={e => handleChange('battery', e.target.value)}
//         />
//         <Input
//           label="Battery Life"
//           value={form.batteryLife}
//           onChange={e => handleChange('batteryLife', e.target.value)}
//         />
//         <Input
//           label="Graphics Card"
//           value={form.graphicsCard}
//           onChange={e => handleChange('graphicsCard', e.target.value)}
//         />
//         <Input
//           label="Graphic Brand"
//           value={form.graphicBrand}
//           onChange={e => handleChange('graphicBrand', e.target.value)}
//         />
//         <Input
//           label="Weight"
//           type="number"
//           min="0.01"
//           step="0.01"
//           value={form.weight}
//           onChange={e => handleChange('weight', e.target.value)}
//           placeholder="Enter weight (kg)"
//           required
//         />
//         <Input
//           label="Manufacturer"
//           value={form.manufacturer}
//           onChange={e => handleChange('manufacturer', e.target.value)}
//         />
//         <Input
//           label="USB Ports"
//           type="number"
//           value={form.usbPorts}
//           onChange={e => handleChange('usbPorts', e.target.value)}
//         />
//         <div>
//           <label className="block mb-1 font-medium text-sm">Status</label>
//           <select
//             value={form.status}
//             onChange={e => handleChange('status', e.target.value)}
//             className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           >
//             <option value="ACTIVE">ACTIVE</option>
//             <option value="DELETED">DELETED</option>
//           </select>
//         </div>
//       </div>

//       <div className="flex gap-3 items-center">
//         <button
//           type="submit"
//           disabled={submitting}
//           className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:opacity-50"
//         >
//           {submitting ? 'Submitting…' : 'Add Laptop'}
//         </button>
//         {message && <p className="text-sm text-green-600">{message}</p>}
//         {error && <p className="text-sm text-red-600">{error}</p>}
//       </div>
//     </form>
//   );
// }

// function Input({ label, type = 'text', ...props }) {
//   return (
//     <div>
//       <label className="block mb-1 font-medium text-sm">{label}</label>
//       <input
//         type={type}
//         {...props}
//         className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//       />
//     </div>
//   );
// }




import React, { useState } from 'react';
import { useAddLaptopMutation } from '../store/services/sellerApi';

export default function SellLaptopForm() {
  const initialForm = {
    serialNumber: '',
    dealer: '',
    model: '',
    brand: '',
    price: '',
    warrantyInYear: 1,
    processor: '',
    processorBrand: '',
    memoryType: '',
    screenSize: '',
    colour: '',
    ram: '',
    storage: '',
    battery: '',
    batteryLife: '',
    graphicsCard: '',
    graphicBrand: '',
    manufacturer: '',
    usbPorts: 2,
    status: 'ACTIVE',
    sellerId: 1,
    weight: '',  // added weight field as string initially
  };

  const [form, setForm] = useState(initialForm);
  const [addLaptop, { isLoading }] = useAddLaptopMutation();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    if (
      field === 'price' ||
      field === 'warrantyInYear' ||
      field === 'usbPorts' ||
      field === 'sellerId'
    ) {
      setForm(prev => ({
        ...prev,
        [field]: Number(value || 0),
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    // serial number validation
    const serialRegex = /^[A-Za-z0-9\-]+$/;
    if (!serialRegex.test(form.serialNumber)) {
      setError("Serial Number may contain only letters, digits or hyphens");
      setSubmitting(false);
      return;
    }

    // weight validation: convert and ensure > 0
    const weightNum = Number(form.weight);
    if (form.weight === '' || isNaN(weightNum) || weightNum <= 0) {
      setError("Weight must be a number greater than zero");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price || 0),
      weight: weightNum,
    };

    try {
      const data = await addLaptop(payload).unwrap();
      setMessage(data?.message || 'Laptop added successfully');
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
          label="Serial Number"
          value={form.serialNumber}
          onChange={e => handleChange('serialNumber', e.target.value)}
          required
        />
        <Input
          label="Dealer"
          value={form.dealer}
          onChange={e => handleChange('dealer', e.target.value)}
          required
        />
        <Input
          label="Model"
          value={form.model}
          onChange={e => handleChange('model', e.target.value)}
          required
        />
        <Input
          label="Brand"
          value={form.brand}
          onChange={e => handleChange('brand', e.target.value)}
          required
        />
        <Input
          label="Price (₹)"
          type="number"
          value={form.price}
          onChange={e => handleChange('price', e.target.value)}
          required
        />
        <Input
          label="Warranty (Years)"
          type="number"
          value={form.warrantyInYear}
          onChange={e => handleChange('warrantyInYear', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Processor"
          value={form.processor}
          onChange={e => handleChange('processor', e.target.value)}
        />
        <Input
          label="Processor Brand"
          value={form.processorBrand}
          onChange={e => handleChange('processorBrand', e.target.value)}
        />
        <Input
          label="Memory Type"
          value={form.memoryType}
          onChange={e => handleChange('memoryType', e.target.value)}
        />
        <Input
          label="Screen Size"
          value={form.screenSize}
          onChange={e => handleChange('screenSize', e.target.value)}
        />
        <Input
          label="Colour"
          value={form.colour}
          onChange={e => handleChange('colour', e.target.value)}
        />
        <Input
          label="RAM"
          value={form.ram}
          onChange={e => handleChange('ram', e.target.value)}
        />
        <Input
          label="Storage"
          value={form.storage}
          onChange={e => handleChange('storage', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Battery"
          value={form.battery}
          onChange={e => handleChange('battery', e.target.value)}
        />
        <Input
          label="Battery Life"
          value={form.batteryLife}
          onChange={e => handleChange('batteryLife', e.target.value)}
        />
        <Input
          label="Graphics Card"
          value={form.graphicsCard}
          onChange={e => handleChange('graphicsCard', e.target.value)}
        />
        <Input
          label="Graphic Brand"
          value={form.graphicBrand}
          onChange={e => handleChange('graphicBrand', e.target.value)}
        />
        <Input
          label="Manufacturer"
          value={form.manufacturer}
          onChange={e => handleChange('manufacturer', e.target.value)}
        />
        <Input
          label="USB Ports"
          type="number"
          value={form.usbPorts}
          onChange={e => handleChange('usbPorts', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Weight"
          type="number"
          min="0.01"
          step="0.01"
          value={form.weight}
          onChange={e => handleChange('weight', e.target.value)}
          placeholder="Enter weight (kg)"
          required
        />
        <div>
          <label className="block mb-1 font-medium text-sm">Status</label>
          <select
            value={form.status}
            onChange={e => handleChange('status', e.target.value)}
            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="DELETED">DELETED</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Submitting…' : 'Add Laptop'}
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
