import { useState } from "react";
import "../../styles/orders.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([
    { id: "PO-1045", supplier: "ABC Electronics", item: "Laptop Batteries", qty: 25, status: "Pending" },
    { id: "PO-6776", supplier: "Global Textiles", item: "Uniform Fabric", qty: 100, status: "Approved" },
    { id: "PO-0102", supplier: "Nexa Solutions", item: "Network Cables", qty: 60, status: "In Transit" },
    { id: "PO-2201", supplier: "Prime Supplies", item: "Office Paper", qty: 40, status: "Delivered" },
  ]);

  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    supplier: "",
    item: "",
    qty: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createOrder = () => {
    if (!form.supplier || !form.item || !form.qty) return;

    const newOrder = {
      id: `PO-${Math.floor(1000 + Math.random() * 9000)}`,
      supplier: form.supplier,
      item: form.item,
      qty: form.qty,
      status: form.status,
    };

    setOrders([newOrder, ...orders]);

    setForm({ supplier: "", item: "", qty: "", status: "Pending" });
    setShowCreate(false);
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  const filtered = orders.filter((o) => {
    const matchSearch = Object.values(o).some((v) =>
      v.toString().toLowerCase().includes(search.toLowerCase())
    );

    const matchFilter = filter === "All" || o.status === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="orders-page">

      {/* TOP */}
      <div className="orders-top">
        <button className="add-order-btn" onClick={() => setShowCreate(true)}>
          Create Order
        </button>

        <div className="orders-actions">
          <input
            className="search-input"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="orders-summary">
        <div className="order-box blue">Total: {orders.length}</div>
        <div className="order-box orange">
          Pending: {orders.filter(o => o.status === "Pending").length}
        </div>
        <div className="order-box green">
          Delivered: {orders.filter(o => o.status === "Delivered").length}
        </div>
      </div>

      {/* TABLE */}
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Supplier</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.supplier}</td>
                <td>{o.item}</td>
                <td>{o.qty}</td>
                <td>{o.status}</td>

                <td>
                  <button
                    className="order-table-btn"
                    onClick={() => {
                      setSelectedOrder(o);
                      setShowView(true);
                    }}
                  >
                    View
                  </button>

                  <button
                    className="order-table-btn"
                    onClick={() => deleteOrder(o.id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="modal-overlay">
          <div className="order-modal">
            <h2>Create Order</h2>

            <div className="modal-group">
              <label>Supplier</label>
              <input name="supplier" value={form.supplier} onChange={handleChange} />
            </div>

            <div className="modal-group">
              <label>Item</label>
              <input name="item" value={form.item} onChange={handleChange} />
            </div>

            <div className="modal-group">
              <label>Qty</label>
              <input name="qty" value={form.qty} onChange={handleChange} />
            </div>

            <div className="modal-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Pending</option>
                <option>Approved</option>
                <option>In Transit</option>
                <option>Delivered</option>
              </select>
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={createOrder}>Save</button>
              <button className="close-btn" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showView && selectedOrder && (
        <div className="modal-overlay">
          <div className="order-modal">
            <h2>Order Details</h2>

            <div className="view-order-details">
              <p><b>ID:</b> {selectedOrder.id}</p>
              <p><b>Supplier:</b> {selectedOrder.supplier}</p>
              <p><b>Item:</b> {selectedOrder.item}</p>
              <p><b>Qty:</b> {selectedOrder.qty}</p>
              <p><b>Status:</b> {selectedOrder.status}</p>
            </div>

            <div className="modal-buttons">
              <button className="close-btn" onClick={() => setShowView(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OrdersPage;