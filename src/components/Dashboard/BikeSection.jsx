import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getBikesBySeller,
  deleteBike,
} from "../../store/services/bikeServices";

import { CategoryWrapper, Table, Th, Td, ActionBtn } from "./TableCommon";

export default function BikeSection({ onDataLoad }) {
  const navigate = useNavigate();
  const sellerId = Number(localStorage.getItem("sellerId"));

  const [items, setItems] = useState([]);
  const reportedRef = useRef(false);

  useEffect(() => {
    loadBikes();
    // eslint-disable-next-line
  }, []);

  const loadBikes = async () => {
    try {
      const data = await getBikesBySeller(sellerId);
      const safeData = Array.isArray(data) ? data : [];
      setItems(safeData);

      if (!reportedRef.current && onDataLoad) {
        reportedRef.current = true;
        onDataLoad(safeData);
      }
    } catch {
      toast.error("Failed to load bikes");
    }
  };

  const onEdit = (item) => {
    const id = item.bikeId ?? item.id ?? item.bike_id;
    navigate(`/sell-bike/${id}`, { state: { mode: "edit", item } });
  };

  const onDelete = async (item) => {
    const id = item.bikeId ?? item.id ?? item.bike_id;
    if (!window.confirm("Delete this bike?")) return;

    try {
      await deleteBike(id);
      toast.success("Bike deleted");
      loadBikes();
    } catch {
      toast.error("Bike delete failed");
    }
  };

  return (
    <CategoryWrapper title="Bike Listings">
      {items.length === 0 ? (
        <p>No bikes found</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Brand</Th>
              <Th>Model</Th>
              <Th>Variant</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.bikeId ?? b.id}>
                <Td>{b.brand}</Td>
                <Td>{b.model}</Td>
                <Td>{b.variant}</Td>
                <Td>{b.prize}</Td>
                <Td>{b.status}</Td>
                <Td>
                  <ActionBtn color="blue" onClick={() => onEdit(b)}>
                    Edit
                  </ActionBtn>
                  <ActionBtn color="red" onClick={() => onDelete(b)}>
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
