// src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Shared components
import DashboardStats from "../../components/DashboardStats";
import MyListings from "../../components/MyListing";

// Service functions
import {
  getLaptopsByStatus,
  deleteLaptop,
  updateLaptop,
} from "../../store/services/laptopServices";

import {
  getBikesByStatus,
  deleteBike,
  updateBike,
} from "../../store/services/bikeServices";

import { getCarsBySeller } from "../../store/services/carServices";
import { getMobilesBySeller } from "../../store/services/mobileServices";

const STATUS_FILTERS = ["ACTIVE", "PENDING", "SOLD"];

export default function Dashboard() {
  const navigate = useNavigate();
  const sellerId = Number(localStorage.getItem("sellerId"));

  const [activeCategory, setActiveCategory] = useState("LAPTOPS");

  const [laptops, setLaptops] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [cars, setCars] = useState([]);
  const [mobiles, setMobiles] = useState([]);

  const [loading, setLoading] = useState(false);

  // Laptop editing
  const [editingLaptop, setEditingLaptop] = useState(null);
  const [editLaptopForm, setEditLaptopForm] = useState({
    price: "",
    status: "ACTIVE",
  });
  const [savingLaptop, setSavingLaptop] = useState(false);

  // Bike editing
  const [editingBike, setEditingBike] = useState(null);
  const [editBikeForm, setEditBikeForm] = useState({
    prize: "",
    status: "ACTIVE",
  });
  const [savingBike, setSavingBike] = useState(false);

  /* ---------------------------------------------------
     FETCH LAPTOPS BY STATUS
  --------------------------------------------------- */
  const fetchLaptops = useCallback(async () => {
    if (!sellerId) return;

    setLoading(true);
    try {
      const responses = await Promise.allSettled(
        STATUS_FILTERS.map((status) =>
          getLaptopsByStatus(sellerId, status).then((data) => ({
            status,
            data: Array.isArray(data) ? data : [],
          }))
        )
      );

      const merged = responses.flatMap((result, idx) => {
        if (result.status !== "fulfilled") return [];
        return result.value.data.map((item) => ({
          ...item,
          status: item.status || STATUS_FILTERS[idx],
        }));
      });

      setLaptops(merged);
    } catch (err) {
      console.error("Failed to load laptops", err);
      toast.error("Failed to load laptops.");
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  /* ---------------------------------------------------
     FETCH BIKES BY STATUS
  --------------------------------------------------- */
  const fetchBikes = useCallback(async () => {
    if (!sellerId) return;

    setLoading(true);
    try {
      const responses = await Promise.allSettled(
        STATUS_FILTERS.map((status) =>
          getBikesByStatus(sellerId, status).then((data) => ({
            status,
            data: Array.isArray(data) ? data : [],
          }))
        )
      );

      const merged = responses.flatMap((result, idx) => {
        if (result.status !== "fulfilled") return [];
        return result.value.data.map((item) => ({
          ...item,
          status: item.status || STATUS_FILTERS[idx],
        }));
      });

      setBikes(merged);
    } catch (err) {
      console.error("Failed to load bikes", err);
      toast.error("Failed to load bikes.");
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  /* ---------------------------------------------------
     LOAD CATEGORY ITEMS
  --------------------------------------------------- */
  useEffect(() => {
    if (!sellerId) return;

    const loadCategory = async () => {
      setLoading(true);
      try {
        if (activeCategory === "LAPTOPS") {
          await fetchLaptops();
        } else if (activeCategory === "BIKES") {
          await fetchBikes();
        } else if (activeCategory === "CARS") {
          const data = await getCarsBySeller(sellerId);
          setCars(data);
        } else if (activeCategory === "MOBILES") {
          const data = await getMobilesBySeller(sellerId);
          setMobiles(data);
        }
      } catch (err) {
        console.error("Loading failed", err);
        toast.error("Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [activeCategory, sellerId, fetchLaptops, fetchBikes]);

  /* ---------------------------------------------------
     DELETE LAPTOP
  --------------------------------------------------- */
  const handleDeleteLaptop = async (listing) => {
    const id = listing.id ?? listing.laptopId;
    if (!id) return toast.error("Invalid laptop id.");
    if (!window.confirm("Delete this laptop listing?")) return;

    try {
      await deleteLaptop(id);
      toast.success("Laptop deleted.");

      setLaptops((prev) =>
        prev.filter((item) => (item.id ?? item.laptopId) !== id)
      );
    } catch (err) {
      console.error("Delete laptop failed", err);
      toast.error("Delete failed.");
    }
  };

  /* ---------------------------------------------------
     START EDIT LAPTOP
  --------------------------------------------------- */
  const handleStartEditLaptop = (listing) => {
    setEditingLaptop(listing);
    setEditLaptopForm({
      price: listing.price ?? listing.expectedPrice ?? "",
      status: listing.status ?? "ACTIVE",
    });
  };

  const handleSaveLaptopEdit = async () => {
    if (!editingLaptop) return;
    const id = editingLaptop.id ?? editingLaptop.laptopId;
    if (!id) return toast.error("Invalid laptop id.");

    setSavingLaptop(true);
    try {
      const payload = {
        ...editingLaptop,
        price: Number(editLaptopForm.price),
        status: editLaptopForm.status,
        sellerId,
      };

      await updateLaptop(id, payload);
      toast.success("Laptop updated.");

      setLaptops((prev) =>
        prev.map((item) =>
          (item.id ?? item.laptopId) === id
            ? { ...item, price: payload.price, status: payload.status }
            : item
        )
      );

      setEditingLaptop(null);
    } catch (err) {
      console.error("Update laptop failed", err);
      toast.error("Update failed.");
    } finally {
      setSavingLaptop(false);
    }
  };

  /* ---------------------------------------------------
     DELETE BIKE
  --------------------------------------------------- */
  const handleDeleteBike = async (bikeId) => {
    if (!window.confirm("Delete this bike listing?")) return;

    try {
      await deleteBike(bikeId);
      toast.success("Bike deleted.");

      setBikes((prev) => prev.filter((item) => item.bikeId !== bikeId));
    } catch (err) {
      console.error("Failed to delete bike", err);
      toast.error("Failed to delete bike.");
    }
  };

  /* ---------------------------------------------------
     START EDIT BIKE
  --------------------------------------------------- */
  const handleStartEditBike = (bike) => {
    setEditingBike(bike);
    setEditBikeForm({
      prize: bike.prize,
      status: bike.status,
    });
  };

  /* ---------------------------------------------------
     SAVE BIKE EDIT
  --------------------------------------------------- */
  const handleSaveBikeEdit = async () => {
    if (!editingBike) return;

    const bikeId = editingBike.bikeId;
    if (!bikeId) return toast.error("Invalid bike id.");

    setSavingBike(true);
    try {
      const payload = {
        ...editingBike,
        prize: Number(editBikeForm.prize),
        status: editBikeForm.status,
      };

      await updateBike(bikeId, payload);
      toast.success("Bike updated.");

      setBikes((prev) =>
        prev.map((item) =>
          item.bikeId === bikeId ? { ...item, ...payload } : item
        )
      );

      setEditingBike(null);
    } catch (err) {
      console.error("Bike update failed", err);
      toast.error("Failed to update bike.");
    } finally {
      setSavingBike(false);
    }
  };

  /* ---------------------------------------------------
     NAVIGATION
  --------------------------------------------------- */
  const handleSellProduct = () => {
    navigate("/sellfrom");
  };

  /* ---------------------------------------------------
     RENDER UI
  --------------------------------------------------- */
  return (
    <div className="container mx-auto px-4 py-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <button
          onClick={handleSellProduct}
          className="px-5 py-2 bg-green-600 text-white rounded-md"
        >
          + Sell Product
        </button>
      </div>

      {/* Status Summary Cards */}
      <div className="mb-6">
        <DashboardStats
          listings={
            activeCategory === "BIKES"
              ? bikes
              : activeCategory === "LAPTOPS"
              ? laptops
              : activeCategory === "CARS"
              ? cars
              : mobiles
          }
        />
      </div>

      {/* Category Buttons */}
      <div className="flex gap-3 mb-6">
        {["LAPTOPS", "BIKES", "CARS", "MOBILES"].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-md font-semibold ${
              activeCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LAPTOPS */}
      {activeCategory === "LAPTOPS" && (
        <MyListings
          listings={laptops}
          onDelete={handleDeleteLaptop}
          onEdit={handleStartEditLaptop}
        />
      )}

      {/* BIKES */}
      {activeCategory === "BIKES" && (
        <BikeTable
          items={bikes}
          onEdit={handleStartEditBike}
          onDelete={handleDeleteBike}
        />
      )}

      {/* CARS */}
      {activeCategory === "CARS" && <CarTable items={cars} />}

      {/* MOBILES */}
      {activeCategory === "MOBILES" && <MobileTable items={mobiles} />}

      {/* Laptop Edit Modal */}
      {editingLaptop && (
        <EditLaptopModal
          form={editLaptopForm}
          listing={editingLaptop}
          onChange={(f, v) => setEditLaptopForm({ ...editLaptopForm, [f]: v })}
          onClose={() => setEditingLaptop(null)}
          onSave={handleSaveLaptopEdit}
          saving={savingLaptop}
        />
      )}

      {/* Bike Edit Modal */}
      {editingBike && (
        <EditBikeModal
          bike={editingBike}
          form={editBikeForm}
          onChange={(f, v) => setEditBikeForm({ ...editBikeForm, [f]: v })}
          onClose={() => setEditingBike(null)}
          onSave={handleSaveBikeEdit}
          saving={savingBike}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------
   BIKE TABLE COMPONENT
--------------------------------------------------- */
function BikeTable({ items, onEdit, onDelete }) {
  return (
    <CategoryWrapper title="Bike Listings">
      {items.length === 0 ? (
        <p>No bikes found.</p>
      ) : (
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Brand</th>
              <th className="p-2 border">Model</th>
              <th className="p-2 border">Variant</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => {
              const key = b.bikeId ?? b.id ?? b.bike_id; // ⭐ robust key
              return (
                <tr key={key} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{b.brand}</td>
                  <td className="p-2 border">{b.model}</td>
                  <td className="p-2 border">{b.variant}</td>
                  <td className="p-2 border">₹ {b.prize}</td>
                  <td className="p-2 border">{b.status}</td>
                  <td className="p-2 flex gap-2 border">
                    <button
                      onClick={() => onEdit(b)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(b.bikeId ?? b.id ?? b.bike_id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </CategoryWrapper>
  );
}


function CarTable({ items }) {
  return (
    <CategoryWrapper title="Car Listings">
      {items.length === 0 ? (
        <p>No cars found.</p>
      ) : (
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Brand</th>
              <th className="p-2 border">Model</th>
              <th className="p-2 border">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.carId}>
                <td className="p-2 border">{c.brand}</td>
                <td className="p-2 border">{c.model}</td>
                <td className="p-2 border">₹ {c.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CategoryWrapper>
  );
}

function MobileTable({ items }) {
  return (
    <CategoryWrapper title="Mobile Listings">
      {items.length === 0 ? (
        <p>No mobiles found.</p>
      ) : (
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Brand</th>
              <th className="p-2 border">Model</th>
              <th className="p-2 border">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.mobileId}>
                <td className="p-2 border">{m.brand}</td>
                <td className="p-2 border">{m.model}</td>
                <td className="p-2 border">₹ {m.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </CategoryWrapper>
  );
}

function CategoryWrapper({ title, children }) {
  return (
    <div className="p-4 border rounded-md bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

/* ---------------------------------------------------
   EDIT LAPTOP MODAL
--------------------------------------------------- */
function EditLaptopModal({ listing, form, onChange, onClose, onSave, saving }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold">Edit Laptop</h2>
        <p className="text-sm text-gray-500 mb-4">
          {listing.brand} {listing.model}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price (₹)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => onChange("price", e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => onChange("status", e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   EDIT BIKE MODAL
--------------------------------------------------- */
function EditBikeModal({ bike, form, onChange, onClose, onSave, saving }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold">Edit Bike</h2>
        <p className="text-sm text-gray-500 mb-4">
          {bike.brand} {bike.model}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price (₹)
            </label>
            <input
              type="number"
              value={form.prize}
              onChange={(e) => onChange("prize", e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => onChange("status", e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}



// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// // SERVICES
// import {
//   getLaptopsByStatus,
//   deleteLaptop,
// } from "../store/services/laptopServices";

// import { getBikesBySeller, deleteBike } from "../store/services/bikeServices";

// import { getCarsBySeller, deleteCar } from "../store/services/carServices";

// import {
//   getMobilesBySeller,
//   deleteMobile,
// } from "../store/services/mobileServices";

// const STATUS_FILTERS = ["ACTIVE", "PENDING", "SOLD"];

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const sellerId = Number(localStorage.getItem("sellerId"));

//   const [activeCategory, setActiveCategory] = useState("LAPTOPS");

//   const [laptops, setLaptops] = useState([]);
//   const [bikes, setBikes] = useState([]);
//   const [cars, setCars] = useState([]);
//   const [mobiles, setMobiles] = useState([]);

//   const [loading, setLoading] = useState(false);

//   /** FETCH LAPTOP */
//   const fetchLaptops = useCallback(async () => {
//     try {
//       setLoading(true);

//       const results = await Promise.allSettled(
//         STATUS_FILTERS.map((status) =>
//           getLaptopsByStatus(sellerId, status).then((data) => ({
//             status,
//             data: Array.isArray(data) ? data : [],
//           }))
//         )
//       );

//       const merged = results.flatMap((res, idx) => {
//         if (res.status !== "fulfilled") return [];
//         return res.value.data.map((item) => ({
//           ...item,
//           status: item.status || STATUS_FILTERS[idx],
//         }));
//       });

//       setLaptops(merged);
//     } catch {
//       toast.error("Failed to load laptops");
//     } finally {
//       setLoading(false);
//     }
//   }, [sellerId]);

//   /** FETCH ON CATEGORY CHANGE */
//   useEffect(() => {
//     if (!sellerId) return;

//     const load = async () => {
//       setLoading(true);
//       try {
//         if (activeCategory === "LAPTOPS") await fetchLaptops();

//         if (activeCategory === "BIKES") {
//           const data = await getBikesBySeller(sellerId);
//           setBikes(Array.isArray(data) ? data : []);
//         }

//         if (activeCategory === "CARS") {
//           const data = await getCarsBySeller(sellerId);
//           setCars(Array.isArray(data) ? data : []);
//         }

//         if (activeCategory === "MOBILES") {
//           const data = await getMobilesBySeller(sellerId);
//           setMobiles(Array.isArray(data) ? data : []);
//         }
//       } catch {
//         toast.error("Load failed");
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [activeCategory, sellerId, fetchLaptops]);

//   /** ---- DELETE HANDLERS ---- */

//   const handleDeleteLaptop = async (item) => {
//     const id = item.laptopId ?? item.id ?? item.laptop_id;

//     if (!id) return toast.error("Laptop ID missing");

//     if (!window.confirm("Delete this laptop?")) return;

//     try {
//       await deleteLaptop(id);
//       setLaptops((l) => l.filter((x) => (x.laptopId ?? x.id ?? x.laptop_id) !== id));
//       toast.success("Laptop deleted");
//     } catch (error) {
//       console.error("Delete laptop error:", error);
//       toast.error(error?.response?.data?.message || "Delete failed");
//     }
//   };

//   const handleDeleteBike = async (idOrObj) => {
//     const id =
//       typeof idOrObj === "number"
//         ? idOrObj
//         : idOrObj.bike_id ?? idOrObj.id ?? idOrObj.bikeId;

//     if (!id) return toast.error("Bike ID missing");
//     if (!window.confirm("Delete this bike?")) return;

//     try {
//       await deleteBike(id);
//       setBikes((l) => l.filter((x) => (x.bike_id ?? x.id ?? x.bikeId) !== id));
//       toast.success("Bike deleted");
//     } catch (error) {
//       console.error("Delete bike error:", error);
//       toast.error(error?.response?.data?.message || "Bike delete failed");
//     }
//   };

//   const handleDeleteCar = async (idOrObj) => {
//     const id =
//       typeof idOrObj === "number"
//         ? idOrObj
//         : idOrObj.carId ?? idOrObj.id ?? idOrObj.car_id;

//     if (!id) return toast.error("Car ID missing");
//     if (!window.confirm("Delete this car?")) return;

//     try {
//       await deleteCar(id);
//       setCars((l) => l.filter((x) => (x.carId ?? x.id ?? x.car_id) !== id));
//       toast.success("Car deleted");
//     } catch (error) {
//       console.error("Delete car error:", error);
//       toast.error(error?.response?.data?.message || "Car delete failed");
//     }
//   };

//   const handleDeleteMobile = async (idOrObj) => {
//     const id =
//       typeof idOrObj === "number"
//         ? idOrObj
//         : idOrObj.mobileId ?? idOrObj.id ?? idOrObj.mobile_id;

//     if (!id) return toast.error("Mobile ID missing");
//     if (!window.confirm("Delete this mobile?")) return;

//     try {
//       await deleteMobile(id);
//       setMobiles((l) => l.filter((x) => (x.mobileId ?? x.id ?? x.mobile_id) !== id));
//       toast.success("Mobile deleted");
//     } catch (error) {
//       console.error("Delete mobile error:", error);
//       toast.error(error?.response?.data?.message || "Mobile delete failed");
//     }
//   };

//   /** ---- EDIT ROUTERS ---- */

//   const goToEditLaptop = (item) => {
//     const id = item.laptopId ?? item.id ?? item.laptop_id;
//     if (!id) return toast.error("Laptop ID missing");

//     navigate(`/sell-laptop/${id}`, { state: { mode: "edit", item } });
//   };

//   const goToEditBike = (item) => {
//     const id = item.bike_id ?? item.id ?? item.bikeId;
//     if (!id) return toast.error("Bike ID missing");

//     navigate(`/sell-bike/${id}`, { state: { mode: "edit", item } });
//   };

//   const goToEditCar = (item) => {
//     const id = item.carId ?? item.id ?? item.car_id;
//     if (!id) return toast.error("Car ID missing");

//     navigate(`/sell-car/${id}`, { state: { mode: "edit", item } });
//   };

//   const goToEditMobile = (item) => {
//     const id = item.mobileId ?? item.id ?? item.mobile_id;
//     if (!id) return toast.error("Mobile ID missing");

//     navigate(`/sell-mobile/${id}`, { state: { mode: "edit", item } });
//   };

//   /** ---- UI ---- */
//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Dashboard</h1>
//         <button
//           onClick={() => navigate("/sellfrom")}
//           className="px-5 py-2 bg-green-600 text-white rounded-md"
//         >
//           + Sell Product
//         </button>
//       </div>

//       {/* TABS */}
//       <div className="flex gap-3 mb-6">
//         {["LAPTOPS", "BIKES", "CARS", "MOBILES"].map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setActiveCategory(cat)}
//             className={`px-5 py-2 rounded-md font-semibold ${
//               activeCategory === cat
//                 ? "bg-indigo-600 text-white"
//                 : "bg-gray-200 text-gray-800"
//             }`}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* TABLES */}
//       {activeCategory === "LAPTOPS" && (
//         <LaptopTable
//           items={laptops}
//           onEdit={goToEditLaptop}
//           onDelete={handleDeleteLaptop}
//         />
//       )}

//       {activeCategory === "BIKES" && (
//         <BikeTable
//           items={bikes}
//           onEdit={goToEditBike}
//           onDelete={handleDeleteBike}
//         />
//       )}

//       {activeCategory === "CARS" && (
//         <CarTable
//           items={cars}
//           onEdit={goToEditCar}
//           onDelete={handleDeleteCar}
//         />
//       )}

//       {activeCategory === "MOBILES" && (
//         <MobileTable
//           items={mobiles}
//           onEdit={goToEditMobile}
//           onDelete={handleDeleteMobile}
//         />
//       )}
//     </div>
//   );
// }

// /* ------------------ TABLE COMPONENTS -------------------- */

// function CategoryWrapper({ title, children }) {
//   return (
//     <div className="p-4 border rounded-md bg-white shadow-sm">
//       <h2 className="text-xl font-semibold mb-3">{title}</h2>
//       {children}
//     </div>
//   );
// }

// function Table({ children }) {
//   return (
//     <table className="w-full border rounded-lg bg-white">{children}</table>
//   );
// }

// function Th({ children }) {
//   return <th className="p-3 border bg-gray-100">{children}</th>;
// }

// function Td({ children }) {
//   return <td className="p-3 border text-sm">{children}</td>;
// }

// function ActionBtn({ children, onClick, color }) {
//   const cls =
//     color === "blue"
//       ? "bg-blue-600 hover:bg-blue-700"
//       : "bg-red-600 hover:bg-red-700";

//   return (
//     <button
//       onClick={onClick}
//       className={`px-3 py-1 rounded-md text-white text-sm ${cls}`}
//     >
//       {children}
//     </button>
//   );
// }

// /* ---- INDIVIDUAL TABLES ---- */

// function LaptopTable({ items, onEdit, onDelete }) {
//   return (
//     <CategoryWrapper title="Laptop Listings">
//       {items.length === 0 ? (
//         <p>No laptops found</p>
//       ) : (
//         <Table>
//           <thead>
//             <tr>
//               <Th>Brand</Th>
//               <Th>Model</Th>
//               <Th>Price</Th>
//               <Th>Status</Th>
//               <Th>Actions</Th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((l) => (
//               <tr key={l.laptopId ?? l.id}>
//                 <Td>{l.brand}</Td>
//                 <Td>{l.model}</Td>
//                 <Td>{l.price}</Td>
//                 <Td>{l.status}</Td>
//                 <Td>
//                   <ActionBtn onClick={() => onEdit(l)} color="blue">
//                     Edit
//                   </ActionBtn>
//                   <ActionBtn onClick={() => onDelete(l)} color="red">
//                     Delete
//                   </ActionBtn>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </CategoryWrapper>
//   );
// }

// function BikeTable({ items, onEdit, onDelete }) {
//   return (
//     <CategoryWrapper title="Bike Listings">
//       {items.length === 0 ? (
//         <p>No bikes found</p>
//       ) : (
//         <Table>
//           <thead>
//             <tr>
//               <Th>Brand</Th>
//               <Th>Model</Th>
//               <Th>Variant</Th>
//               <Th>Price</Th>
//               <Th>Status</Th>
//               <Th>Actions</Th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((b) => (
//               <tr key={b.bike_id}>
//                 <Td>{b.brand}</Td>
//                 <Td>{b.model}</Td>
//                 <Td>{b.variant}</Td>
//                 <Td>{b.prize}</Td>
//                 <Td>{b.status}</Td>
//                 <Td>
//                   <ActionBtn onClick={() => onEdit(b)} color="blue">
//                     Edit
//                   </ActionBtn>
//                   <ActionBtn onClick={() => onDelete(b)} color="red">
//                     Delete
//                   </ActionBtn>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </CategoryWrapper>
//   );
// }

// function CarTable({ items, onEdit, onDelete }) {
//   return (
//     <CategoryWrapper title="Car Listings">
//       {items.length === 0 ? (
//         <p>No cars found</p>
//       ) : (
//         <Table>
//           <thead>
//             <tr>
//               <Th>Brand</Th>
//               <Th>Model</Th>
//               <Th>Price</Th>
//               <Th>Actions</Th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((c) => (
//               <tr key={c.carId}>
//                 <Td>{c.brand}</Td>
//                 <Td>{c.model}</Td>
//                 <Td>{c.price}</Td>
//                 <Td>
//                   <ActionBtn onClick={() => onEdit(c)} color="blue">
//                     Edit
//                   </ActionBtn>
//                   <ActionBtn onClick={() => onDelete(c)} color="red">
//                     Delete
//                   </ActionBtn>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </CategoryWrapper>
//   );
// }

// function MobileTable({ items, onEdit, onDelete }) {
//   return (
//     <CategoryWrapper title="Mobile Listings">
//       {items.length === 0 ? (
//         <p>No mobiles found</p>
//       ) : (
//         <Table>
//           <thead>
//             <tr>
//               <Th>Brand</Th>
//               <Th>Model</Th>
//               <Th>Price</Th>
//               <Th>Actions</Th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((m) => (
//               <tr key={m.mobileId}>
//                 <Td>{m.brand}</Td>
//                 <Td>{m.model}</Td>
//                 <Td>{m.price}</Td>
//                 <Td>
//                   <ActionBtn onClick={() => onEdit(m)} color="blue">
//                     Edit
//                   </ActionBtn>
//                   <ActionBtn onClick={() => onDelete(m)} color="red">
//                     Delete
//                   </ActionBtn>
//                 </Td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </CategoryWrapper>
//   );
// }
