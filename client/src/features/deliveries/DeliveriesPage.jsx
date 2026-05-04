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

  // MODALS
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const [form, setForm] = useState({
    id: "",
    order: "",
    supplier: "",
    status: "In Transit",
    date: "",
  });

  // INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD
  const addDelivery = () => {
    if (!form.id || !form.order || !form.supplier || !form.date) return;

    setDeliveries([...deliveries, form]);

    setForm({
      id: "",
      order: "",
      supplier: "",
      status: "In Transit",
      date: "",
    });

    setShowModal(false);
  };

  // DELETE
  const confirmDelete = () => {
    setDeliveries(deliveries.filter((d) => d.id !== deleteItem.id));
    setDeleteItem(null);
  };

  // FILTER
  const filtered = deliveries.filter((d) => {
    const matchFilter = filter === "All" || d.status === filter;

    const matchSearch =
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.supplier.toLowerCase().includes(search.toLowerCase()) ||
      d.order.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  return (
    <div className="deliveries-page">

      {/* TOP */}
      <div className="deliveries-top">
        <button className="add-delivery-btn" onClick={() => setShowModal(true)}>
          Add Delivery
        </button>

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
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((d) => (
            <tr key={d.id}>
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
                <button className="delivery-table-btn" onClick={() => setViewItem(d)}>
                  View
                </button>

                <button className="delivery-table-btn" onClick={() => setDeleteItem(d)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= ADD MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="delivery-modal">
            <h2>Add Delivery</h2>

            <input name="id" placeholder="Shipment ID" value={form.id} onChange={handleChange} />
            <input name="order" placeholder="Order ID" value={form.order} onChange={handleChange} />
            <input name="supplier" placeholder="Supplier" value={form.supplier} onChange={handleChange} />

            <select name="status" value={form.status} onChange={handleChange}>
              <option>In Transit</option>
              <option>Delivered</option>
              <option>Delayed</option>
            </select>

            <input type="date" name="date" value={form.date} onChange={handleChange} />

            <div className="modal-buttons">
              <button className="save-btn" onClick={addDelivery}>Save</button>
              <button className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW MODAL ================= */}
      {viewItem && (
        <div className="modal-overlay">
          <div className="delivery-modal">
            <h2>Delivery Details</h2>

            <p><b>Shipment:</b> {viewItem.id}</p>
            <p><b>Order:</b> {viewItem.order}</p>
            <p><b>Supplier:</b> {viewItem.supplier}</p>
            <p><b>Status:</b> {viewItem.status}</p>
            <p><b>Date:</b> {viewItem.date}</p>

            <div className="modal-buttons">
              <button className="close-btn" onClick={() => setViewItem(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {deleteItem && (
        <div className="modal-overlay">
          <div className="delivery-modal">
            <h2>Confirm Delete</h2>

            <p>Are you sure you want to delete <b>{deleteItem.id}</b>?</p>

            <div className="modal-buttons">
              <button className="save-btn" onClick={confirmDelete}>
                Yes, Delete
              </button>

              <button className="close-btn" onClick={() => setDeleteItem(null)}>
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