import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getCarsBySeller, deleteCar } from "../../store/services/carServices";
import { CategoryWrapper, Table, Th, Td, ActionBtn } from "./TableCommon";

export default function CarSection({ onDataLoad }) {
  const navigate = useNavigate();
  const sellerId = Number(localStorage.getItem("sellerId"));

  const [items, setItems] = useState([]);
  const reportedRef = useRef(false);

  useEffect(() => {
    loadCars();
    // eslint-disable-next-line
  }, []);

  const loadCars = async () => {
    try {
      const data = await getCarsBySeller(sellerId);
      const safeData = Array.isArray(data) ? data : [];
      setItems(safeData);

      if (!reportedRef.current && onDataLoad) {
        reportedRef.current = true;
        onDataLoad(safeData);
      }
    } catch {
      toast.error("Failed to load cars");
    }
  };

  const onEdit = (item) => {
    const id = item.carId ?? item.id;
    navigate(`/sell-car/${id}`, { state: { mode: "edit", item } });
  };

  const onDelete = async (item) => {
    const id = item.carId ?? item.id;
    if (!window.confirm("Delete this car?")) return;

    try {
      await deleteCar(id);
      toast.success("Car deleted");
      loadCars();
    } catch {
      toast.error("Car delete failed");
    }
  };

  return (
    <CategoryWrapper title="Car Listings">
      {items.length === 0 ? (
        <p>No cars found</p>
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
            {items.map((c) => (
              <tr key={c.carId ?? c.id}>
                <Td>{c.brand}</Td>
                <Td>{c.model}</Td>
                <Td>{c.price}</Td>
                <Td>{c.status}</Td>
                <Td>
                  <ActionBtn color="blue" onClick={() => onEdit(c)}>
                    Edit
                  </ActionBtn>
                  <ActionBtn color="red" onClick={() => onDelete(c)}>
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
