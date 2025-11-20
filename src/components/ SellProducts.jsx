// import { useState } from 'react';

// export default function SellProducts() {
//   const [form, setForm] = useState({
//     category: 'electronics',
//     subCategory: 'mobiles',
//     title: '',
//     brand: '',
//     model: '',
//     price: '',
//     description: '',
//     image: null,
//   });

//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const newErrors = {};

//     if (!form.title.trim()) {
//       newErrors.title = 'Title is required.';
//     }
//     if (!form.brand.trim()) {
//       newErrors.brand = 'Brand is required.';
//     }
//     if (!form.model.trim()) {
//       newErrors.model = 'Model/Variant is required.';
//     }
//     if (!form.price || Number(form.price) <= 0) {
//       newErrors.price = 'Please enter a valid price.';
//     }
//     if (!form.description.trim()) {
//       newErrors.description = 'Description is required.';
//     }
//     if (!form.image) {
//       newErrors.image = 'Please upload an image.';
//     }
//     // You can add more rules e.g. min length description, etc.

//     setErrors(newErrors);
//     // Return true if no errors
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = e => {
//     e.preventDefault();
//     if (!validate()) {
//       // there are validation errors – don’t submit
//       return;
//     }
//     // TODO: send form data to backend
//     console.log('Submitting', form);
//   };

//   return (
//     <div className="container mx-auto py-12 px-4">
//       <h2 className="text-3xl font-bold mb-6">Sell Your Product</h2>
//       <form onSubmit={handleSubmit} className="space-y-6" noValidate>
//         {/* Category */}
//         <div>
//           <label className="block mb-1">Category</label>
//           <select
//             value={form.category}
//             onChange={e =>
//               setForm({
//                 ...form,
//                 category: e.target.value,
//                 subCategory: '', // reset subCategory when category changes
//               })
//             }
//             className="border rounded p-2 w-full md:w-64"
//           >
//             <option value="electronics">Electronics</option>
//             <option value="vehicles">Vehicles</option>
//           </select>
//         </div>

//         {/* Sub-Category */}
//         <div>
//           <label className="block mb-1">Sub-Category</label>
//           <select
//             value={form.subCategory}
//             onChange={e =>
//               setForm({
//                 ...form,
//                 subCategory: e.target.value,
//               })
//             }
//             className="border rounded p-2 w-full md:w-64"
//           >
//             {form.category === 'electronics' ? (
//               <>
//                 <option value="mobiles">Mobiles</option>
//                 <option value="laptops">Laptops</option>
//               </>
//             ) : (
//               <>
//                 <option value="cars">Cars</option>
//                 <option value="bikes">Bikes</option>
//               </>
//             )}
//           </select>
//         </div>

//         {/* Title */}
//         <div>
//           <label className="block mb-1">Title</label>
//           <input
//             type="text"
//             value={form.title}
//             onChange={e => setForm({ ...form, title: e.target.value })}
//             className={`border rounded p-2 w-full ${
//               errors.title ? 'border-red-500' : ''
//             }`}
//             placeholder="Enter product title"
//           />
//           {errors.title && (
//             <p className="text-red-500 text-sm mt-1">{errors.title}</p>
//           )}
//         </div>

//         {/* Brand */}
//         <div>
//           <label className="block mb-1">Brand</label>
//           <input
//             type="text"
//             value={form.brand}
//             onChange={e => setForm({ ...form, brand: e.target.value })}
//             className={`border rounded p-2 w-full ${
//               errors.brand ? 'border-red-500' : ''
//             }`}
//             placeholder="Brand name"
//           />
//           {errors.brand && (
//             <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
//           )}
//         </div>

//         {/* Model */}
//         <div>
//           <label className="block mb-1">Model</label>
//           <input
//             type="text"
//             value={form.model}
//             onChange={e => setForm({ ...form, model: e.target.value })}
//             className={`border rounded p-2 w-full ${
//               errors.model ? 'border-red-500' : ''
//             }`}
//             placeholder="Model/Variant"
//           />
//           {errors.model && (
//             <p className="text-red-500 text-sm mt-1">{errors.model}</p>
//           )}
//         </div>

//         {/* Price */}
//         <div>
//           <label className="block mb-1">Price (₹)</label>
//           <input
//             type="number"
//             value={form.price}
//             onChange={e => setForm({ ...form, price: e.target.value })}
//             className={`border rounded p-2 w-full ${
//               errors.price ? 'border-red-500' : ''
//             }`}
//             placeholder="Enter asking price"
//           />
//           {errors.price && (
//             <p className="text-red-500 text-sm mt-1">{errors.price}</p>
//           )}
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block mb-1">Description</label>
//           <textarea
//             value={form.description}
//             onChange={e => setForm({ ...form, description: e.target.value })}
//             className={`border rounded p-2 w-full ${
//               errors.description ? 'border-red-500' : ''
//             }`}
//             placeholder="Describe the product condition, features..."
//           />
//           {errors.description && (
//             <p className="text-red-500 text-sm mt-1">{errors.description}</p>
//           )}
//         </div>

//         {/* Image */}
//         <div>
//           <label className="block mb-1">Image</label>
//           <input
//             type="file"
//             onChange={e => setForm({ ...form, image: e.target.files[0] })}
//             className="w-full"
//           />
//           {errors.image && (
//             <p className="text-red-500 text-sm mt-1">{errors.image}</p>
//           )}
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
//         >
//           List Product
//         </button>
//       </form>
//     </div>
//   );
// }



// src/pages/SellProducts.jsx
import { useState } from 'react';

export default function SellProducts() {
  const [form, setForm] = useState({
    category: 'electronics',
    subCategory: 'mobiles',
    title: '',
    brand: '',
    model: '',
    price: '',
    description: '',
    image: null,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    if (!form.brand.trim()) newErrors.brand = 'Brand is required.';
    if (!form.model.trim()) newErrors.model = 'Model/Variant is required.';
    if (!form.price || Number(form.price) <= 0) newErrors.price = 'Please enter a valid price.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';
    if (!form.image) newErrors.image = 'Please upload an image.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: send form data to backend
    console.log('Submitting', form);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Sell Your Product</h2>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto" noValidate>
        {/* Category & Sub-category row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value, subCategory: '' })}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="electronics">Electronics</option>
              <option value="vehicles">Vehicles</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Sub-Category</label>
            <select
              value={form.subCategory}
              onChange={e => setForm({ ...form, subCategory: e.target.value })}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {form.category === 'electronics' ? (
                <>
                  <option value="mobiles">Mobiles</option>
                  <option value="laptops">Laptops</option>
                </>
              ) : (
                <>
                  <option value="cars">Cars</option>
                  <option value="bikes">Bikes</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? 'border-red-500 focus:ring-red-500' : ''
            }`}
            placeholder="Enter product title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Brand + Model (row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Brand</label>
            <input
              type="text"
              value={form.brand}
              onChange={e => setForm({ ...form, brand: e.target.value })}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.brand ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="Brand name"
            />
            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Model</label>
            <input
              type="text"
              value={form.model}
              onChange={e => setForm({ ...form, model: e.target.value })}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.model ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="Model/Variant"
            />
            {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price (₹)</label>
          <input
            type="number"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.price ? 'border-red-500 focus:ring-red-500' : ''
            }`}
            placeholder="Enter asking price"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className={`w-full border rounded-md p-2 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.description ? 'border-red-500 focus:ring-red-500' : ''
            }`}
            placeholder="Describe the product condition, features..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1 font-medium">Image</label>
          <input
            type="file"
            onChange={e => setForm({ ...form, image: e.target.files[0] })}
            className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.image ? 'border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
          >
            List Product
          </button>
        </div>
      </form>
    </div>
  );
}
