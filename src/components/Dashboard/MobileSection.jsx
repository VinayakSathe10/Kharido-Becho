import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  getMobilesBySeller,
  deleteMobile,
} from "../../store/services/mobileServices";

import { CategoryWrapper, Table, Th, Td, ActionBtn } from "./TableCommon";

export default function MobileSection({ onDataLoad }) {
  const navigate = useNavigate();
  const sellerId = Number(localStorage.getItem("sellerId"));

  const [items, setItems] = useState([]);
  const reportedRef = useRef(false);

  useEffect(() => {
    loadMobiles();
    // eslint-disable-next-line
  }, []);

  const loadMobiles = async () => {
    try {
      const data = await getMobilesBySeller(sellerId);
      const safeData = Array.isArray(data) ? data : [];
      setItems(safeData);

      if (!reportedRef.current && onDataLoad) {
        reportedRef.current = true;
        onDataLoad(safeData);
      }
    } catch {
      toast.error("Failed to load mobiles");
    }
  };

  const onEdit = (item) => {
    const id = item.mobileId ?? item.id;
    navigate(`/sell-mobile/${id}`, { state: { mode: "edit", item } });
  };

  const onDelete = async (item) => {
    const id = item.mobileId ?? item.id;
    if (!window.confirm("Delete this mobile?")) return;

    try {
      await deleteMobile(id);
      toast.success("Mobile deleted");
      loadMobiles();
    } catch {
      toast.error("Mobile delete failed");
    }
  };

  return (
    <CategoryWrapper title="Mobile Listings">
      {items.length === 0 ? (
        <p>No mobiles found</p>
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
            {items.map((m) => (
              <tr key={m.mobileId ?? m.id}>
                <Td>{m.brand}</Td>
                <Td>{m.model}</Td>
                <Td>{m.price}</Td>
                <Td>{m.status}</Td>
                <Td>
                  <ActionBtn color="blue" onClick={() => onEdit(m)}>
                    Edit
                  </ActionBtn>
                  <ActionBtn color="red" onClick={() => onDelete(m)}>
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
