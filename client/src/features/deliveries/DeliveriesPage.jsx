import { useState } from "react";
import "../../styles/deliveries.css";

const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([
    { id: "Shipment #469", order: "PO-1076", supplier: "ABC Electronics", status: "In Transit", date: "2024-04-02" },
    { id: "Shipment #465", order: "PO-1068", supplier: "Nexa Solutions", status: "Delivered", date: "2024-04-15" },
    { id: "Shipment #462", order: "PO-1058", supplier: "EastEnd Traders", status: "Delayed", date: "2024-04-14" },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [form, setForm] = useState({
    id: "",
    order: "",
    supplier: "",
    status: "In Transit",
    date: ""
  });

  const filtered = deliveries.filter(d =>
    (filter === "All" || d.status === filter) &&
    (d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.supplier.toLowerCase().includes(search.toLowerCase()))
  );

  const addDelivery = () => {
    if (!form.id || !form.order || !form.supplier || !form.date) {
      alert("Please fill all fields");
      return;
    }

    setDeliveries([...deliveries, form]);
    setShowModal(false);
    setForm({ id: "", order: "", supplier: "", status: "In Transit", date: "" });
  };

  return (
    <div className="deliveries-page">

      {/* TOP */}
      <div className="deliveries-top">
        <button onClick={() => setShowModal(true)} className="add-delivery-btn">
          Add Delivery
        </button>

        <div className="deliveries-actions">
          <input
            className="search-input"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
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
            <th>Shipment ID</th>
            <th>Order ID</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>Expected Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((d, index) => (
            <tr key={index}>
              <td>{d.id}</td>
              <td>{d.order}</td>
              <td>{d.supplier}</td>
              <td>
                <span className={`status-badge ${d.status.toLowerCase().replace(" ", "-")}`}>
                  {d.status}
                </span>
              </td>
              <td>{d.date}</td>
              <td>
                <button className="delivery-table-btn" onClick={() => setViewData(d)}>
                  View
                </button>

                <button className="delivery-table-btn" onClick={() => setDeleteIndex(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ➕ ADD MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="delivery-modal">
            <h2>Add Delivery</h2>

            <input placeholder="Shipment ID"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />

            <input placeholder="Order ID"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
            />

            <input placeholder="Supplier"
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>In Transit</option>
              <option>Delivered</option>
              <option>Delayed</option>
            </select>

            <input type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <div className="modal-buttons">
              <button className="save-btn" onClick={addDelivery}>Save</button>
              <button className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* 👁 VIEW MODAL (FIXED) */}
      {viewData && (
        <div className="modal-overlay">
          <div className="delivery-modal">
            <h2>Delivery Details</h2>

            <p><b>Shipment:</b> {viewData.id}</p>
            <p><b>Order:</b> {viewData.order}</p>
            <p><b>Supplier:</b> {viewData.supplier}</p>
            <p><b>Status:</b> {viewData.status}</p>
            <p><b>Date:</b> {viewData.date}</p>

            <div className="modal-buttons">
              <button className="close-btn" onClick={() => setViewData(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ❌ DELETE MODAL */}
      {deleteIndex !== null && (
        <div className="modal-overlay">
          <div className="delivery-modal">
            <h2>Confirm Delete</h2>

            <p>Are you sure you want to delete this delivery?</p>

            <div className="modal-buttons">
              <button
                className="save-btn"
                onClick={() => {
                  setDeliveries(deliveries.filter((_, i) => i !== deleteIndex));
                  setDeleteIndex(null);
                }}
              >
                Yes, Delete
              </button>

              <button
                className="close-btn"
                onClick={() => setDeleteIndex(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DeliveriesPage;