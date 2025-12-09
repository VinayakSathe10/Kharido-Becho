import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useSellerId from "../../pages/useSellerId";
import {
  addBike as addBikeService,
  updateBike,
  getBikeById,
  uploadBikeImage as uploadBikeImageService,
} from "../../store/services/bikeServices";

const initialForm = {
  prize: "",
  brand: "",
  model: "",
  variant: "",
  manufactureYear: "",
  engineCC: "",
  kilometersDriven: "",
  fuelType: "PETROL",
  color: "",
  registrationNumber: "",
  description: "",
  status: "ACTIVE",
};

export default function SellBikeForm({ productId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    sellerId,
    loading: sellerLoading,
    error: sellerError,
  } = useSellerId();

  const isEditMode = !!productId || location.state?.mode === "edit";
  const editItem = location.state?.item;

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [bikeId, setBikeId] = useState(productId || null);
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  // Fetch bike data in edit mode
  useEffect(() => {
    const fetchBikeData = async () => {
      if (!isEditMode || !productId) return;

      try {
        setLoading(true);
        const bike = await getBikeById(productId);

        if (bike) {
          setForm({
            prize: bike.prize || "",
            brand: bike.brand || "",
            model: bike.model || "",
            variant: bike.variant || "",
            manufactureYear: bike.manufactureYear || "",
            engineCC: bike.engineCC || "",
            kilometersDriven: bike.kilometersDriven || "",
            fuelType: bike.fuelType || "PETROL",
            color: bike.color || "",
            registrationNumber: bike.registrationNumber || "",
            description: bike.description || "",
            status: bike.status || "ACTIVE",
          });
        }
      } catch (error) {
        console.error("Failed to fetch bike:", error);
        toast.error("Failed to load bike data");
      } finally {
        setLoading(false);
      }
    };

    // If editItem is provided in state, use it directly
    if (isEditMode && editItem) {
      setForm({
        prize: editItem.prize || "",
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
      });
    } else {
      fetchBikeData();
    }
  }, [isEditMode, productId, editItem]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: [
        "prize",
        "manufactureYear",
        "engineCC",
        "kilometersDriven",
      ].includes(field)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!sellerId) {
      setError("Seller profile missing. Please login again.");
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        ...form,
        prize: Number(form.prize),
        sellerId,
      };

      if (isEditMode && productId) {
        // UPDATE MODE
        await updateBike(productId, payload);
        toast.success("Bike updated successfully!");
        navigate("/dashboard");
      } else {
        // CREATE MODE
        const data = await addBikeService(payload);

        const newBikeId =
          data?.bike_id || data?.id || data?.bikeId || data?.data?.bike_id;

        setBikeId(newBikeId);
        setMessage("Bike added successfully! Now upload images.");
        setForm(initialForm);
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err.message || "Something went wrong";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!images.length) {
      setUploadMsg("Please select images first.");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      images.forEach((img) => formData.append("files", img)); // <-- matches backend
      formData.append("bikeId", bikeId);

      await uploadBikeImageService(formData);

      setUploadMsg("Images uploaded successfully!");
      setImages([]);
    } catch (err) {
      setUploadMsg("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <p>Loading bike data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? "Edit Bike" : "Sell Your Bike"}
      </h1>
      {/* IMAGE UPLOAD SCREEN */}
      {bikeId && !isEditMode ? (
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">
            Upload Images for Bike ID: {bikeId}
          </h2>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...e.target.files])}
            className="border p-2 rounded"
          />

          <button
            onClick={handleImageUpload}
            disabled={isUploading}
            className="ml-3 px-5 py-2 bg-indigo-600 text-white rounded-md"
          >
            {isUploading ? "Uploading…" : "Upload Images"}
          </button>

          {uploadMsg && (
            <p className="mt-2 text-green-600 text-sm">{uploadMsg}</p>
          )}
        </div>
      ) : (
        /* BIKE FORM */
        <form onSubmit={handleSubmit} className="space-y-4">
          <SellerInfoBanner
            sellerId={sellerId}
            loading={sellerLoading}
            error={sellerError}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prize (₹)"
              type="number"
              required
              value={form.prize}
              onChange={(e) => handleChange("prize", e.target.value)}
            />
            <Input
              label="Brand"
              required
              value={form.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
            />
            <Input
              label="Model"
              required
              value={form.model}
              onChange={(e) => handleChange("model", e.target.value)}
            />
            <Input
              label="Variant"
              required
              value={form.variant}
              onChange={(e) => handleChange("variant", e.target.value)}
            />
            <Input
              label="Manufacture Year"
              type="number"
              required
              value={form.manufactureYear}
              onChange={(e) => handleChange("manufactureYear", e.target.value)}
            />
            <Input
              label="Engine CC"
              type="number"
              required
              value={form.engineCC}
              onChange={(e) => handleChange("engineCC", e.target.value)}
            />
            <Input
              label="Kilometers Driven"
              type="number"
              required
              value={form.kilometersDriven}
              onChange={(e) => handleChange("kilometersDriven", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Fuel Type"
              value={form.fuelType}
              onChange={(e) => handleChange("fuelType", e.target.value)}
              placeholder="e.g. PETROL, DIESEL"
            />
            <Input
              label="Color"
              required
              value={form.color}
              onChange={(e) => handleChange("color", e.target.value)}
            />
            <Input
              label="Registration Number"
              required
              value={form.registrationNumber}
              onChange={(e) =>
                handleChange("registrationNumber", e.target.value)
              }
            />
            <Input
              label="Status"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              placeholder="e.g. ACTIVE"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-sm">
              Description
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border rounded-md p-2 text-sm h-24"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-md"
          >
            {isLoading
              ? isEditMode
                ? "Updating…"
                : "Submitting…"
              : isEditMode
              ? "Update Bike"
              : "Add Bike"}
          </button>

          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      )}
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
          {error || "You must be logged in as a seller."}
        </p>
      )}
    </div>
  );
}

function Input({ label, type = "text", ...props }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type={type}
        {...props}
        className="w-full border p-2 rounded-md text-sm"
      />
    </div>
  );
}
