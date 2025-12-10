import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getLaptopsByStatus,
  deleteLaptop,
} from "../../store/services/laptopServices";

import { CategoryWrapper, Table, Th, Td, ActionBtn } from "./TableCommon";

const STATUS = ["ACTIVE", "PENDING", "SOLD"];

export default function LaptopSection({ onDataLoad }) {
  const navigate = useNavigate();
  const sellerId = Number(localStorage.getItem("sellerId"));

  const [items, setItems] = useState([]);

  // ✅ Prevent infinite parent-child render loop
  const hasReportedRef = useRef(false);

  useEffect(() => {
    loadLaptops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLaptops = async () => {
    try {
      const results = await Promise.all(
        STATUS.map((status) => getLaptopsByStatus(sellerId, status))
      );

      const merged = results.flat().filter(Boolean);

      setItems(merged);

      // ✅ Update dashboard stats ONLY ONCE
      if (!hasReportedRef.current && typeof onDataLoad === "function") {
        hasReportedRef.current = true;
        onDataLoad(merged);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load laptops");
    }
  };

  const onEdit = (item) => {
    const id = item.laptopId ?? item.id ?? item.laptop_id;
    navigate(`/sell-laptop/${id}`, { state: { mode: "edit", item } });
  };

  const onDelete = async (item) => {
    const id = item.laptopId ?? item.id ?? item.laptop_id;

    if (!window.confirm("Delete this laptop?")) return;

    try {
      await deleteLaptop(id);
      toast.success("Laptop deleted");
      loadLaptops();
    } catch (err) {
      console.error(err);
      toast.error("Laptop delete failed");
    }
  };

  return (
    <CategoryWrapper title="Laptop Listings">
      {items.length === 0 ? (
        <p>No laptops found</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Brand</Th>
              <Th>Model</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>

          <tbody>
            {items.map((l) => (
              <tr key={l.laptopId ?? l.id}>
                <Td>{l.brand}</Td>
                <Td>{l.model}</Td>
                <Td>{l.price}</Td>
                <Td>{l.status}</Td>
                <Td>
                  <ActionBtn color="blue" onClick={() => onEdit(l)}>
                    Edit
                  </ActionBtn>
                  <ActionBtn color="red" onClick={() => onDelete(l)}>
                    Delete
                  </ActionBtn>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </CategoryWrapper>
  );
}
