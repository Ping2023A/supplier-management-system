import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/deliveries.css";

const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${API_URL}/api/integration/logistics/delivery-status`)
      .then((res) => {
        const mapped = (res.data.data || []).map((d) => ({
          shipmentId:
            d.trackingNumber || d.shipmentId || `Shipment-${d.orderId}`,
          order: d.orderId,
          supplier: d.supplier,
          status: d.status || "Pending",
          date: d.estimatedArrival
            ? new Date(d.estimatedArrival).toLocaleDateString()
            : "No ETA",
          item: d.item,
          qty: d.qty,
          category: d.category,
        }));

        setDeliveries(mapped);
      })
      .catch((err) => console.error("Error fetching deliveries:", err));
  }, [API_URL]);

  const filtered = deliveries.filter((d) => {
    const matchFilter = filter === "All" || d.status === filter;

    const matchSearch =
      String(d.shipmentId).toLowerCase().includes(search.toLowerCase()) ||
      String(d.supplier).toLowerCase().includes(search.toLowerCase()) ||
      String(d.order).toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="deliveries-page">
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
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>
      </div>

      <div className="deliveries-summary">
        <div className="delivery-box blue">
          In Transit:{" "}
          {deliveries.filter((d) => d.status === "In Transit").length}
        </div>

        <div className="delivery-box green">
          Delivered:{" "}
          {deliveries.filter((d) => d.status === "Delivered").length}
        </div>

        <div className="delivery-box red">
          Delayed: {deliveries.filter((d) => d.status === "Delayed").length}
        </div>
      </div>

      <div className="deliveries-table-wrapper">
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
              <tr key={d.order}>
                <td>{d.shipmentId}</td>
                <td>{d.order}</td>
                <td>{d.supplier}</td>
                <td>{d.item}</td>
                <td>{d.qty}</td>
                <td>{d.status}</td>
                <td>{d.category}</td>
                <td>{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveriesPage;