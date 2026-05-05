import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/deliveries.css";

const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Load deliveries from backend (orders act as deliveries)
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Map orders into deliveries with shipmentId
        const mapped = res.data.map((o) => ({
          shipmentId: `Shipment-${Math.floor(1000 + Math.random() * 9000)}`,
          order: o.id,
          supplier: o.supplier,
          status: o.status,
          date: o.deliveryDate, // use actual deliveryDate from OrdersPage
          item: o.item,
          qty: o.qty,
          category: o.category,
        }));
        setDeliveries(mapped);
      })
      .catch((err) => console.error("Error fetching deliveries:", err));
  }, []);

  // FILTER
  const filtered = deliveries.filter((d) => {
    const matchFilter = filter === "All" || d.status === filter;
    const matchSearch =
      d.shipmentId.toLowerCase().includes(search.toLowerCase()) ||
      d.supplier.toLowerCase().includes(search.toLowerCase()) ||
      d.order.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="deliveries-page">
      {/* TOP */}
      <div className="deliveries-top">
        <div className="deliveries-actions">
          <input
            className="search-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="deliveries-summary">
        <div className="delivery-box blue">
          In Transit: {deliveries.filter(d => d.status === "In Transit").length}
        </div>
        <div className="delivery-box green">
          Delivered: {deliveries.filter(d => d.status === "Delivered").length}
        </div>
        <div className="delivery-box red">
          Delayed: {deliveries.filter(d => d.status === "Delayed").length}
        </div>
      </div>

      {/* TABLE */}
      <table className="deliveries-table">
        <thead>
          <tr>
            <th>Shipment</th>
            <th>Order</th>
            <th>Supplier</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Category</th>
            <th>Delivery Date</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => (
            <tr key={d.shipmentId}>
              <td>{d.shipmentId}</td>
              <td>{d.order}</td>
              <td>{d.supplier}</td>
              <td>{d.item}</td>
              <td>{d.qty}</td>
              <td>
                <span className={`status-badge ${d.status.toLowerCase().replace(" ", "-")}`}>
                  {d.status}
                </span>
              </td>
              <td>{d.category}</td>
              <td>{d.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveriesPage;
