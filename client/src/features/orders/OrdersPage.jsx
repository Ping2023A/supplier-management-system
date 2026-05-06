import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/orders.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    supplier: "",
    item: "",
    qty: "",
    status: "Pending",
    category: "Electronics",
    deliveryDate: "", // delivery date field
  });

  // Category → prefix mapping
  const categoryPrefixes = {
    "Clothing and Apparel": "CA",
    "Home and Living": "HL",
    "Electronics": "E",
  };

  // Load orders from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createOrder = async () => {
    if (!form.supplier || !form.item || !form.qty || !form.deliveryDate) return;

    const prefix = categoryPrefixes[form.category] || "GEN";
    const newOrder = {
      id: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      supplier: form.supplier,
      item: form.item,
      qty: form.qty,
      status: form.status,
      category: form.category,
      deliveryDate: form.deliveryDate,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/orders", newOrder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders([res.data, ...orders]);
      setForm({ supplier: "", item: "", qty: "", status: "Pending", category: "Electronics", deliveryDate: "" });
      setShowCreate(false);
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  const updateOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5000/api/orders/${selectedOrder.id}`, selectedOrder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.map(o => o.id === selectedOrder.id ? res.data : o));
      setShowEdit(false);
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const deleteOrder = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(orders.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
    }
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
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
            <option value="In Transit">In Transit</option>
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
              <th>Category</th>
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
                <td>{o.category}</td>
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
                    onClick={() => {
                      setSelectedOrder(o);
                      setShowEdit(true);
                    }}
                  >
                    Edit
                  </button>
                  <button className="order-table-btn" onClick={() => deleteOrder(o.id)}>
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
                <option>Delivered</option>
                <option>Delayed</option>
                <option>In Transit</option>
              </select>
            </div>
            <div className="modal-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option>Clothing and Apparel</option>
                <option>Home and Living</option>
                <option>Electronics</option>
              </select>
            </div>
            <div className="modal-group">
              <label>Delivery Date</label>
              <input type="date" name="deliveryDate" value={form.deliveryDate} onChange={handleChange} />
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
              <p><b>Category:</b> {selectedOrder.category}</p>
              <p><b>Delivery Date:</b> {selectedOrder.deliveryDate}</p>
            </div>
            <div className="modal-buttons">
              <button className="close-btn" onClick={() => setShowView(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && selectedOrder && (
        <div className="modal-overlay">
          <div className="order-modal">
            <h2>Edit Order</h2>
            <div className="modal-group">
              <label>Supplier</label>
              <input
                name="supplier"
                value={selectedOrder.supplier}
                onChange={(e) =>
                  setSelectedOrder({ ...selectedOrder, supplier: e.target.value })
                }
              />
            </div>
            <div className="modal-group">
              <label>Item</label>
              <input
                name="item"
                value={selectedOrder.item}
                onChange={(e) =>
                  setSelectedOrder({ ...selectedOrder, item: e.target.value })
                }
              />
            </div>
            <div className="modal-group">
              <label>Qty</label>
              <input
                name="qty"
                value={selectedOrder.qty}
                onChange={(e) =>
                  setSelectedOrder({ ...selectedOrder, qty: e.target.value })
                }
              />
            </div>
            <div className="modal-group">
              <label>Status</label>
              <select
                name="status"
                value={selectedOrder.status}
                onChange={(e) =>
                  setSelectedOrder({ ...selectedOrder, status: e.target.value })
                }
              >
                <option>Pending</option>
                <option>Delivered</option>
                <option>Delayed</option>
                <option>In Transit</option>
              </select>
            </div>
            <div className="modal-group">
              <label>Category</label>
              <select
                name="category"
                value={selectedOrder.category}
                onChange={(e) =>
                  setSelectedOrder({ ...selectedOrder, category: e.target.value })
                }
              >
                <option>Clothing and Apparel</option>
                <option>Home and Living</option>
                <option>Electronics</option>
              </select>
            </div>
            <div className="modal-group">
              <label>Delivery Date</label>
              <input
                type="date"
                name="deliveryDate"
                value={selectedOrder.deliveryDate}
                onChange={(e) =>
                  setSelectedOrder({ ...selectedOrder, deliveryDate: e.target.value })
                }
              />
            </div>
            <div className="modal-buttons">
              <button className="save-btn" onClick={updateOrder}>Save</button>
              <button className="close-btn" onClick={() => setShowEdit(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
