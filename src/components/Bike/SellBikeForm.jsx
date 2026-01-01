import React, { useState, useEffect } from "react";
import ImageUploader from "../common/ImageUploader";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useSellerId from "../../pages/useSellerId";
import {
  addBike as addBikeService,
  updateBike,
  getBikeById,
  uploadBikeImage as uploadBikeImageService,
} from "../../store/services/bikeServices";

import {
  getBikeBrands,
  getBikeModels,
  getBikeVariants,
} from "../../store/services/bikeBrandServices";

const initialForm = {
  title: "",
  description: "",
  price: "",
  brand: "",
  model: "",
  variant: "",
  manufactureYear: "",
  engineCC: "",
  kilometersDriven: "",
  fuelType: "",
  color: "",
  registrationNumber: "",
  status: "ACTIVE",
};

export default function SellBikeForm({ productId: propProductId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams();
  const bikeIdToUse = propProductId || paramId;

  const {
    sellerId,
    loading: sellerLoading,
    error: sellerError,
  } = useSellerId();

  const isEditMode = !!bikeIdToUse || location.state?.mode === "edit";
  const editItem = location.state?.item;

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [bikeId, setBikeId] = useState(bikeIdToUse || null);
  const [loading, setLoading] = useState(false);

  // dropdown data
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);

  // 1️⃣ load brands on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBikeBrands();
        if (res?.status === "success") {
          setBrands(res.data.map((b) => b.brand));
        }
      } catch {
        toast.error("Failed to load brands");
      }
    };
    load();
  }, []);

  // 2️⃣ when editing, preload form values
  useEffect(() => {
    if (!isEditMode) return;

    if (editItem) {
      setForm({
        price: editItem.price || editItem.prize || "",
        brand: editItem.brand || "",
        model: editItem.model || "",
        variant: editItem.variant || "",
        manufactureYear: editItem.manufactureYear || "",
        engineCC: editItem.engineCC || "",
        kilometersDriven: editItem.kilometersDriven || "",
        fuelType: editItem.fuelType || "PETROL",
        color: editItem.color || "",
        registrationNumber: editItem.registrationNumber || "",
        description: editItem.description || "",
        status: editItem.status || "ACTIVE",
        title: editItem.title || "",
      });

      const id = editItem.bike_id || editItem.id || editItem.bikeId;
      if (id) setBikeId(id);
      return;
    }

    // fetch by id
    const loadBike = async () => {
      try {
        setLoading(true);
        const res = await getBikeById(bikeIdToUse);
        if (res) {
          setForm({
            price: res.price || res.prize || "",
            brand: res.brand || "",
            model: res.model || "",
            variant: res.variant || "",
            manufactureYear: res.manufactureYear || "",
            engineCC: res.engineCC || "",
            kilometersDriven: res.kilometersDriven || "",
            fuelType: res.fuelType || "PETROL",
            color: res.color || "",
            registrationNumber: res.registrationNumber || "",
            description: res.description || "",
            status: res.status || "ACTIVE",
            title: res.title || "",
          });
          setBikeId(bikeIdToUse);
        }
      } catch (err) {
        toast.error("Failed to load bike: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBike();
  }, [isEditMode, bikeIdToUse, editItem]);

  // 3️⃣ brand change → load models
  const handleBrandChange = async (brand) => {
    setForm((p) => ({ ...p, brand, model: "", variant: "" }));
    setModels([]);
    setVariants([]);

    try {
      const res = await getBikeModels(brand);
      if (res?.status === "success") setModels(res.data);
    } catch {
      toast.error("Failed to load models");
    }
  };

  // 4️⃣ model change → load variants
  const handleModelChange = async (model) => {
    setForm((p) => ({ ...p, model, variant: "" }));
    setVariants([]);

    try {
      const res = await getBikeVariants(form.brand, model);
      if (res?.status === "success") setVariants(res.data);
    } catch {
      toast.error("Failed to load variants");
    }
  };

  const handleChange = (field, value) => {
    setForm((p) => ({
      ...p,
      [field]: [
        "price",
        "manufactureYear",
        "engineCC",
        "kilometersDriven",
      ].includes(field)
        ? Number(value)
        : value,
    }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));

    if (field === "description") {
      let err = "";
      if (value.length > 200) err = "Max 200 characters allowed";
      setErrors((p) => ({ ...p, description: err }));
    }
  };

  const validateForm = () => {
    const e = {};
    const year = new Date().getFullYear();

    if (!form.brand) e.brand = "Brand required";
    if (!form.model) e.model = "Model required";
    if (!form.variant) e.variant = "Variant required";
    if (!form.manufactureYear) e.manufactureYear = "Year required";
    else if (form.manufactureYear < 1900 || form.manufactureYear > year + 1)
      e.manufactureYear = "Invalid year";
    if (!form.engineCC || form.engineCC <= 0)
      e.engineCC = "Engine CC must be positive";
    if (form.kilometersDriven === "" || form.kilometersDriven < 0)
      e.kilometersDriven = "KM cannot be negative";
    if (!form.price || form.price <= 0) e.price = "Price must be positive";
    if (!form.color) e.color = "Color required";
    if (!form.registrationNumber)
      e.registrationNumber = "Registration required";
    if (!form.description) e.description = "Description required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!sellerId) {
      setError("Seller profile missing. Please login again.");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        ...form,
        prize: Number(form.price || 0), // Map price to prize for backend
        sellerId,
      };

      delete payload.title; // Remove title as backend does not support it

      if (isEditMode) {
        await updateBike(bikeIdToUse, payload);
        toast.success("Bike updated successfully!");
        navigate("/dashboard", { state: { tab: "BIKES" } });
      } else {
        const res = await addBikeService(payload);
        const newId = res?.bike_id || res?.id || res?.bikeId;
        setBikeId(newId);
        setMessage("Bike added successfully! Now upload images.");
        setForm(initialForm);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <p>Loading bike data...</p>;

  return (
    <div className="flex justify-center bg-black items-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-6 sm:p-8">

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          {isEditMode ? "EDIT BIKE FORM" : "SELL YOUR BIKE"}
        </h1>

        {bikeId && !isEditMode ? (
          <ImageUploader
            idValue={bikeId}
            idKey="bikeId"
            uploadService={uploadBikeImageService}
            onSuccess={() => {
              toast.success("Images uploaded successfully!");
              navigate("/dashboard", { state: { tab: "BIKES" } });
            }}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <SellerInfoBanner sellerId={sellerId} loading={sellerLoading} error={sellerError} />

            {/* Responsive Layout Grid */}
            <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* TITLE */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block mb-1 text-sm font-semibold text-gray-700">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-green-400 transition"

                  maxLength={70}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block mb-1 text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm sm:text-base h-28 focus:outline-none focus:ring-2 focus:ring-green-500 hover:border-green-400 transition"
                  maxLength={200}
                />
                <p className="text-right text-xs text-gray-500 mt-1">{form.description.length}/200</p>
                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
              </div>

              {/* BRAND */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Brand</label>
                <select
                  value={form.brand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base h-11 hover:border-green-400 focus:ring-2 focus:ring-green-500 transition"
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* MODEL */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Model</label>
                <select
                  value={form.model}
                  onChange={(e) => handleModelChange(e.target.value)}
                  disabled={!form.brand}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base h-11 hover:border-green-400 disabled:bg-gray-100 transition"
                >
                  <option value="">Select Model</option>
                  {models.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* VARIANT */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Variant</label>
                <select
                  value={form.variant}
                  onChange={(e) => handleChange("variant", e.target.value)}
                  disabled={!form.brand || !form.model}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base h-11 hover:border-green-400 disabled:bg-gray-100 transition"
                >
                  <option value="">Select Variant</option>
                  {variants.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              {/* Manufacture Year */}
              <Input label="Manufacture Year" type="number" value={form.manufactureYear}
                onChange={(e) => handleChange("manufactureYear", e.target.value)} error={errors.manufactureYear} />

              {/* Engine CC */}
              <Input label="Engine CC" type="number" value={form.engineCC}
                onChange={(e) => handleChange("engineCC", e.target.value)} error={errors.engineCC} />

              {/* Kilometers */}
              <Input label="Kilometers Driven" type="number" value={form.kilometersDriven}
                onChange={(e) => handleChange("kilometersDriven", e.target.value)} error={errors.kilometersDriven} />

              {/* Registration */}
              <Input label="Registration Number" value={form.registrationNumber}
                onChange={(e) => handleChange("registrationNumber", e.target.value)} error={errors.registrationNumber} />

              {/* Price */}
              <Input label="Price (₹)" type="number" value={form.price}
                onChange={(e) => handleChange("price", e.target.value)} error={errors.price} />

              {/* COLOR */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Color</label>
                <select
                  value={form.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base h-11 hover:border-green-400 focus:ring-2 focus:ring-green-500 transition"
                >
                  <option value="">Select Color</option>
                  {["Black", "White", "Red", "Blue", "Silver", "Grey", "Matt Black", "Orange", "Yellow", "Green", "Purple", "Brown", "Gold", "Other"]
                    .map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* FUEL TYPE */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Fuel Type</label>
                <select
                  value={form.fuelType}
                  onChange={(e) => handleChange("fuelType", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base h-11 hover:border-green-400 focus:ring-2 focus:ring-green-500 transition"
                >
                  <option value="">Select Fuel</option>
                  <option value="PETROL">Petrol</option>
                  <option value="ELECTRIC">Electric</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-300"
              >
                {isLoading ? "Submitting…" : isEditMode ? "Update Bike" : "Add Bike"}
              </button>
            </div>

            {message && <p className="text-center text-green-600 text-sm">{message}</p>}
            {error && <p className="text-center text-red-600 text-sm">{error}</p>}
          </form>
        )}

      </div>
    </div>
  );
}




function SellerInfoBanner({ sellerId, loading, error }) {
  return (
    <div className="p-3 bg-gray-50 rounded text-sm">
      <p>
        <strong>Seller ID:</strong>{" "}
        {loading ? "Resolving…" : sellerId ?? "Not available"}
      </p>
      {!sellerId && !loading && (
        <p className="text-red-600 mt-1">
          {error || "You must login as seller."}
        </p>
      )}
    </div>
  );
}

function Input({ label, type = "text", error, ...props }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type={type}
        {...props}
        className={`w-full border p-2 rounded-md text-sm ${error ? "border-red-500" : "border-gray-300"
          }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
