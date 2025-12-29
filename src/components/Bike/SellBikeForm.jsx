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

const initialForm = {
  price: "",
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

export default function SellBikeForm({ productId: propProductId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams();

  // Use prop if available, otherwise fall back to url param
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



  // Fetch bike data in edit mode
  useEffect(() => {
    // If not edit mode, nothing to load.
    if (!isEditMode) return;

    // If we have an Item passed in state, prioritize that
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
      });
      // Ensure bikeId is set even if we used state item
      if (!bikeId && (editItem.bike_id || editItem.id || editItem.bikeId)) {
        setBikeId(editItem.bike_id || editItem.id || editItem.bikeId);
      }
      return;
    }

    // Otherwise fetch by ID if available
    const fetchBikeData = async () => {
      if (!bikeIdToUse) return;

      try {
        setLoading(true);
        const bike = await getBikeById(bikeIdToUse);

        if (bike) {
          setForm({
            price: bike.price || bike.prize || "",
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
          setBikeId(bikeIdToUse);
        }
      } catch (error) {
        console.error("Failed to fetch bike:", error);
        toast.error("Failed to load bike data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBikeData();
  }, [isEditMode, bikeIdToUse, editItem]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: [
        "price",
        "manufactureYear",
        "engineCC",
        "kilometersDriven",
      ].includes(field)
        ? Number(value)
        : value,
    }));

    // Real-time validation for description
    if (field === "description") {
      let descError = "";
      if (value.length > 0 && value.length < 50) {
        descError = "Description must be at least 50 chars";
      } else if (value.length > 200) {
        descError = "Description must be less than 200 chars";
      }
      setErrors((prev) => ({ ...prev, description: descError }));
    } else {
      // Clear error for other fields when modified
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!form.brand) newErrors.brand = "Brand is required";
    if (!form.model) newErrors.model = "Model is required";
    if (!form.variant) newErrors.variant = "Variant is required";

    if (!form.manufactureYear) {
      newErrors.manufactureYear = "Year is required";
    } else if (
      form.manufactureYear < 1900 ||
      form.manufactureYear > currentYear + 1
    ) {
      newErrors.manufactureYear = "Invalid year";
    }

    if (!form.engineCC) newErrors.engineCC = "Engine CC is required";
    else if (form.engineCC <= 0) newErrors.engineCC = "Must be positive";

    if (!form.kilometersDriven && form.kilometersDriven !== 0)
      newErrors.kilometersDriven = "Kilometers is required";
    else if (form.kilometersDriven < 0)
      newErrors.kilometersDriven = "Cannot be negative";

    if (!form.fuelType) newErrors.fuelType = "Fuel Type is required";
    if (!form.color) newErrors.color = "Color is required";
    if (!form.registrationNumber) newErrors.registrationNumber = "Reg. Number is required";

    if (!form.price) newErrors.price = "Price is required";
    else if (form.price <= 0) newErrors.price = "Must be positive";

    if (!form.description) newErrors.description = "Description is required";
    else if (form.description.length < 50)
      newErrors.description = "Description must be at least 50 chars";
    else if (form.description.length > 200)
      newErrors.description = "Description must be less than 200 chars";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        price: Number(form.price),
        sellerId,
      };

      if (isEditMode && bikeIdToUse) {
        // UPDATE MODE
        await updateBike(bikeIdToUse, payload);
        toast.success("Bike updated successfully!");
        navigate("/dashboard", { state: { tab: "BIKES" } });
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
        <ImageUploader
          idValue={bikeId}
          idKey="bikeId"
          uploadService={uploadBikeImageService}
          onSuccess={() => toast.success("Images uploaded successfully!")}
        />
      ) : (
        /* BIKE FORM */
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <SellerInfoBanner
            sellerId={sellerId}
            loading={sellerLoading}
            error={sellerError}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Brand"
              value={form.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
              error={errors.brand}
            />
            <Input
              label="Model"
              value={form.model}
              onChange={(e) => handleChange("model", e.target.value)}
              error={errors.model}
            />
            <Input
              label="Variant"
              value={form.variant}
              onChange={(e) => handleChange("variant", e.target.value)}
              error={errors.variant}
            />
            <Input
              label="Manufacture Year"
              type="number"
              value={form.manufactureYear}
              onChange={(e) => handleChange("manufactureYear", e.target.value)}
              error={errors.manufactureYear}
            />
            <Input
              label="Engine CC"
              type="number"
              value={form.engineCC}
              onChange={(e) => handleChange("engineCC", e.target.value)}
              error={errors.engineCC}
            />
            <Input
              label="Kilometers Driven"
              type="number"
              value={form.kilometersDriven}
              onChange={(e) => handleChange("kilometersDriven", e.target.value)}
              error={errors.kilometersDriven}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Fuel Type</label>
              <select
                value={form.fuelType}
                onChange={(e) => handleChange("fuelType", e.target.value)}
                className={`w-full border p-2 rounded-md text-sm h-10 ${errors.fuelType ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <option value="">Select Fuel Type</option>
                {["PETROL", "ELECTRIC", "CNG", "HYBRID"].map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              {errors.fuelType && (
                <p className="text-red-500 text-xs mt-1">{errors.fuelType}</p>
              )}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Color</label>
              <select
                value={form.color}
                onChange={(e) => handleChange("color", e.target.value)}
                className={`w-full border p-2 rounded-md text-sm h-10 ${errors.color ? "border-red-500" : "border-gray-300"
                  }`}
              >
                <option value="">Select Color</option>
                {[
                  "Black",
                  "White",
                  "Red",
                  "Blue",
                  "Silver",
                  "Grey",
                  "Matt Black",
                  "Orange",
                  "Yellow",
                  "Green",
                  "Purple",
                  "Brown",
                  "Gold",
                  "Other",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.color && (
                <p className="text-red-500 text-xs mt-1">{errors.color}</p>
              )}
            </div>
            <Input
              label="Registration Number"
              value={form.registrationNumber}
              onChange={(e) =>
                handleChange("registrationNumber", e.target.value)
              }
              error={errors.registrationNumber}
            />
            <Input
              label="Status"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              placeholder="e.g. ACTIVE"
            />
            <Input
              label="Price (₹)"
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              error={errors.price}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-sm">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`w-full border rounded-md p-2 text-sm h-24 ${errors.description ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
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
