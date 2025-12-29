import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createLaptop,
  updateLaptop,
  getLaptopById,
  uploadLaptopPhoto,
} from "../../store/services/laptopServices";
import useSellerId from "../../pages/useSellerId";

export default function SellLaptopForm({ productId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    sellerId,
    loading: sellerLoading,
    error: sellerError,
  } = useSellerId();

  const isEditMode = !!productId || location.state?.mode === "edit";
  const editItem = location.state?.item;

  const [formData, setFormData] = useState({
    serialNumber: "",
    dealer: "",
    model: "",
    brand: "",
    price: "",
    warrantyInYear: 1,
    processor: "",
    processorBrand: "",
    memoryType: "",
    screenSize: "",
    colour: "",
    ram: "",
    storage: "",
    battery: "",
    batteryLife: "",
    graphicsCard: "",
    graphicBrand: "",
    weight: "",
    manufacturer: "",
    usbPorts: "",
    status: "ACTIVE",
  });

  const [photoFiles, setPhotoFiles] = useState([]);
  const [createdLaptopId, setCreatedLaptopId] = useState(productId || null);
  const [addLoading, setAddLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch laptop data in edit mode
  useEffect(() => {
    const fetchLaptopData = async () => {
      if (!isEditMode || !productId) return;

      try {
        setLoading(true);
        const laptop = await getLaptopById(productId);

        if (laptop) {
          setFormData({
            serialNumber: laptop.serialNumber || "",
            dealer: laptop.dealer || "",
            model: laptop.model || "",
            brand: laptop.brand || "",
            price: laptop.price || "",
            warrantyInYear: laptop.warrantyInYear || 1,
            processor: laptop.processor || "",
            processorBrand: laptop.processorBrand || "",
            memoryType: laptop.memoryType || "",
            screenSize: laptop.screenSize || "",
            colour: laptop.colour || "",
            ram: laptop.ram || "",
            storage: laptop.storage || "",
            battery: laptop.battery || "",
            batteryLife: laptop.batteryLife || "",
            graphicsCard: laptop.graphicsCard || "",
            graphicBrand: laptop.graphicBrand || "",
            weight: laptop.weight || "",
            manufacturer: laptop.manufacturer || "",
            usbPorts: laptop.usbPorts || "",
            status: laptop.status || "ACTIVE",
          });
        }
      } catch (error) {
        console.error("Failed to fetch laptop:", error);
        toast.error("Failed to load laptop data");
      } finally {
        setLoading(false);
      }
    };

    // If editItem is provided in state, use it directly
    if (isEditMode && editItem) {
      setFormData({
        serialNumber: editItem.serialNumber || "",
        dealer: editItem.dealer || "",
        model: editItem.model || "",
        brand: editItem.brand || "",
        price: editItem.price || "",
        warrantyInYear: editItem.warrantyInYear || 1,
        processor: editItem.processor || "",
        processorBrand: editItem.processorBrand || "",
        memoryType: editItem.memoryType || "",
        screenSize: editItem.screenSize || "",
        colour: editItem.colour || "",
        ram: editItem.ram || "",
        storage: editItem.storage || "",
        battery: editItem.battery || "",
        batteryLife: editItem.batteryLife || "",
        graphicsCard: editItem.graphicsCard || "",
        graphicBrand: editItem.graphicBrand || "",
        weight: editItem.weight || "",
        manufacturer: editItem.manufacturer || "",
        usbPorts: editItem.usbPorts || "",
        status: editItem.status || "ACTIVE",
      });
    } else {
      fetchLaptopData();
    }
  }, [isEditMode, productId, editItem]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLaptopSubmit = async (e) => {
    e.preventDefault();

    if (!sellerId) {
      toast.error(sellerError || "Seller ID missing. Please login again.");
      return;
    }

    try {
      setAddLoading(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        usbPorts: Number(formData.usbPorts),
        warrantyInYear: Number(formData.warrantyInYear),
        sellerId,
      };

      if (isEditMode && productId) {
        // UPDATE MODE
        await updateLaptop(productId, payload);
        toast.success("Laptop updated successfully!");
        navigate("/dashboard");
      } else {
        // CREATE MODE
        const res = await createLaptop(payload);
        toast.success(res.message || "Laptop created successfully!");

        const newId =
          res?.data?.id ||
          res?.id ||
          res?.laptopId ||
          res?.message?.match(/id (\d+)/)?.[1];

        setCreatedLaptopId(newId);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.data?.message ||
          (isEditMode ? "Failed to update laptop" : "Failed to add laptop")
      );
    } finally {
      setAddLoading(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (photoFiles.length === 0) {
      toast.error("Select at least one photo");
      return;
    }

    if (!createdLaptopId) {
      toast.error("Create laptop first");
      return;
    }

    try {
      setPhotoLoading(true);
      for (const file of photoFiles) {
        await uploadLaptopPhoto(createdLaptopId, file);
      }
      toast.success("All photos uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Photo upload failed");
    } finally {
      setPhotoLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6">
        <p>Loading laptop data...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "Edit Laptop" : "Add Laptop"}
      </h1>
      <SellerNotice
        sellerId={sellerId}
        loading={sellerLoading}
        error={sellerError}
      />

      <form
        onSubmit={handleLaptopSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {Object.keys(formData).map((key) =>
          key !== "status" ? (
            <div key={key} className="flex flex-col">
              <label className="font-semibold mb-1 capitalize">{key}</label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
          ) : null
        )}

        <button
          type="submit"
          disabled={addLoading || !sellerId || sellerLoading}
          className="col-span-2 bg-blue-600 text-white py-3 rounded mt-4"
        >
          {addLoading
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : sellerLoading
            ? "Resolving seller..."
            : isEditMode
            ? "Update Laptop"
            : "Create Laptop"}
        </button>
      </form>

      {createdLaptopId && !isEditMode && (
        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-bold mb-4">
            Upload Laptop Photos (ID: {createdLaptopId})
          </h2>

          <input
            type="file"
            multiple
            onChange={(e) => setPhotoFiles([...e.target.files])}
            className="mb-4"
          />

          {photoFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {photoFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-32 object-cover rounded shadow"
                />
              ))}
            </div>
          )}

          <button
            onClick={handlePhotoUpload}
            disabled={photoLoading}
            className="bg-green-600 text-white py-2 px-6 rounded"
          >
            {photoLoading ? "Uploading..." : "Upload Photos"}
          </button>
        </div>
      )}
    </div>
  );
}

function SellerNotice({ sellerId, loading, error }) {
  return (
    <div className="mb-4 rounded-md bg-gray-50 p-3 text-sm text-gray-700">
      <p>
        <span className="font-semibold">Seller ID:</span>{" "}
        {loading ? "Resolving…" : sellerId ?? "Not available"}
      </p>
      {!sellerId && !loading && (
        <p className="text-red-600 mt-1">
          {error || "Login as a seller to list laptops."}
        </p>
      )}
    </div>
  );
}

//    import  { useEffect, useState } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import { addLaptop, updateLaptop } from "../store/services/laptopServices";

// export default function SellLaptopForm() {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isEdit = location.state?.mode === "edit";
//   const editItem = location.state?.item;

//   const [form, setForm] = useState({
//     brand: "",
//     model: "",
//     price: "",
//     status: "ACTIVE",
//   });

//   /** --------------------------------------
//    * FILL FORM IN EDIT MODE
//    -------------------------------------- */
//   useEffect(() => {
//     if (isEdit && editItem) {
//       setForm({
//         brand: editItem.brand || "",
//         model: editItem.model || "",
//         price: editItem.price || 0,
//         status: editItem.status || "ACTIVE",
//       });
//     }
//   }, [isEdit, editItem]);

//   const updateField = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   /** --------------------------------------
//    * SUBMIT HANDLER
//    -------------------------------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (isEdit) {
//         // UPDATE MODE
//         await updateLaptop(id, form);
//         toast.success("Laptop updated successfully");
//       } else {
//         // CREATE MODE
//         await addLaptop(form);
//         toast.success("Laptop added successfully");
//       }

//       navigate("/dashboard");
//     } catch (err) {
//       toast.error("Action failed");
//       console.error(err);
//     }
//   };

//   if (isEdit && !editItem) {
//     return (
//       <div className="p-6 text-center text-red-600">
//         Invalid edit request. No item data provided.
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-5 py-6">
//       <h1 className="text-3xl font-bold mb-6">
//         {isEdit ? "Edit Laptop" : "Sell Laptop"}
//       </h1>

//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4"
//       >
//         <InputField
//           label="Brand"
//           value={form.brand}
//           onChange={(e) => updateField("brand", e.target.value)}
//           required
//         />

//         <InputField
//           label="Model"
//           value={form.model}
//           onChange={(e) => updateField("model", e.target.value)}
//           required
//         />

//         <InputField
//           label="Price"
//           type="number"
//           value={form.price}
//           onChange={(e) => updateField("price", e.target.value)}
//           required
//         />

//         <div>
//           <label className="block font-semibold mb-1">Status</label>
//           <select
//             value={form.status}
//             onChange={(e) => updateField("status", e.target.value)}
//             className="w-full border rounded p-2"
//           >
//             <option value="ACTIVE">ACTIVE</option>
//             <option value="PENDING">PENDING</option>
//             <option value="SOLD">SOLD</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="md:col-span-2 bg-indigo-600 text-white py-3 rounded font-semibold"
//         >
//           {isEdit ? "Update Laptop" : "Create Laptop Listing"}
//         </button>
//       </form>
//     </div>
//   );
// }

// /* ----------------------------------------
//    Reusable Input Component
// ---------------------------------------- */
// function InputField({ label, ...props }) {
//   return (
//     <div>
//       <label className="block font-semibold mb-1">{label}</label>
//       <input {...props} className="w-full border rounded p-2" />
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import { addLaptop, updateLaptop } from "../store/services/laptopServices";

// export default function SellLaptopForm() {
//   const { id } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isEdit = location.state?.mode === "edit";
//   const editItem = location.state?.item;

//   const [form, setForm] = useState({
//     brand: "",
//     model: "",
//     price: "",
//     status: "ACTIVE",
//   });

//   /** --------------------------------------
//    * FILL FORM IN EDIT MODE
//    -------------------------------------- */
//   useEffect(() => {
//     if (isEdit && editItem) {
//       setForm({
//         brand: editItem.brand || "",
//         model: editItem.model || "",
//         price: editItem.price || 0,
//         status: editItem.status || "ACTIVE",
//       });
//     }
//   }, [isEdit, editItem]);

//   const updateField = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   /** --------------------------------------
//    * SUBMIT HANDLER
//    -------------------------------------- */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (isEdit) {
//         // UPDATE MODE
//         await updateLaptop(id, form);
//         toast.success("Laptop updated successfully");
//       } else {
//         // CREATE MODE
//         await addLaptop(form);
//         toast.success("Laptop added successfully");
//       }

//       navigate("/dashboard");
//     } catch (err) {
//       toast.error("Action failed");
//       console.error(err);
//     }
//   };

//   if (isEdit && !editItem) {
//     return (
//       <div className="p-6 text-center text-red-600">
//         Invalid edit request. No item data provided.
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-5 py-6">
//       <h1 className="text-3xl font-bold mb-6">
//         {isEdit ? "Edit Laptop" : "Sell Laptop"}
//       </h1>

//       <form
//         onSubmit={handleSubmit}
//         className="grid grid-cols-1 md:grid-cols-2 gap-4"
//       >
//         <InputField
//           label="Brand"
//           value={form.brand}
//           onChange={(e) => updateField("brand", e.target.value)}
//           required
//         />

//         <InputField
//           label="Model"
//           value={form.model}
//           onChange={(e) => updateField("model", e.target.value)}
//           required
//         />

//         <InputField
//           label="Price"
//           type="number"
//           value={form.price}
//           onChange={(e) => updateField("price", e.target.value)}
//           required
//         />

//         <div>
//           <label className="block font-semibold mb-1">Status</label>
//           <select
//             value={form.status}
//             onChange={(e) => updateField("status", e.target.value)}
//             className="w-full border rounded p-2"
//           >
//             <option value="ACTIVE">ACTIVE</option>
//             <option value="PENDING">PENDING</option>
//             <option value="SOLD">SOLD</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="md:col-span-2 bg-indigo-600 text-white py-3 rounded font-semibold"
//         >
//           {isEdit ? "Update Laptop" : "Create Laptop Listing"}
//         </button>
//       </form>
//     </div>
//   );
// }

// /* ----------------------------------------
//    Reusable Input Component
// ---------------------------------------- */
// function InputField({ label, ...props }) {
//   return (
//     <div>
//       <label className="block font-semibold mb-1">{label}</label>
//       <input {...props} className="w-full border rounded p-2" />
//     </div>
//   );
// }
