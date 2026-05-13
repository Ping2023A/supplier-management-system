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
    category: "Electronics",
    deliveryDate: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const categoryPrefixes = {
    "Clothing and Apparel": "CA",
    "Home and Living": "HL",
    Electronics: "E",
  };

  const generateOrderId = (category) => {
    const prefix = categoryPrefixes[category] || "GEN";
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomNumber}`;
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // FETCH ORDERS WITH DELIVERY STATUS
  useEffect(() => {
    axios
      .get(`${API_URL}/api/integration/logistics/delivery-status`)
      .then((res) => {
        const orderData = (res.data.data || []).map((d) => ({
          id: d.orderId,
          supplier: d.supplier,
          item: d.item,
          qty: d.qty,
          status: d.status || "Pending",
          category: d.category,
          deliveryDate: d.estimatedArrival,
          trackingNumber: d.trackingNumber,
        }));

        setOrders(orderData);
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, [API_URL]);

  // CREATE ORDER
  const createOrder = async () => {
    if (!form.supplier || !form.item || !form.qty || !form.deliveryDate) {
      alert("Please fill in all required fields.");
      return;
    }

    const newOrder = {
      id: generateOrderId(form.category),
      supplier: form.supplier,
      item: form.item,
      qty: Number(form.qty),
      status: "Pending",
      category: form.category,
      deliveryDate: form.deliveryDate,
    };

    try {
      const res = await axios.post(
        `${API_URL}/api/orders`,
        newOrder,
        getAuthHeader()
      );

      const savedOrder = res.data.data || res.data;

      setOrders([savedOrder, ...orders]);

      setForm({
        supplier: "",
        item: "",
        qty: "",
        category: "Electronics",
        deliveryDate: "",
      });

      setShowCreate(false);
    } catch (err) {
      console.error("Error creating order:", err);

      if (err.response?.data?.issues) {
        alert(err.response.data.issues.join("\n"));
      } else {
        alert(err.response?.data?.message || "Failed to create order.");
      }
    }
  };

  // UPDATE ORDER
  const updateOrder = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/api/orders/${selectedOrder.id}`,
        {
          ...selectedOrder,
          qty: Number(selectedOrder.qty),
        },
        getAuthHeader()
      );

      const updatedOrder = res.data.data || res.data;

      setOrders(
        orders.map((o) => (o.id === selectedOrder.id ? updatedOrder : o))
      );

      setShowEdit(false);
    } catch (err) {
      console.error("Error updating order:", err);
      alert(err.response?.data?.message || "Failed to update order.");
    }
  };

  // DELETE ORDER
  const deleteOrder = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/orders/${id}`, getAuthHeader());

      setOrders(orders.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Error deleting order:", err);
      alert(err.response?.data?.message || "Failed to delete order.");
    }
  };

  // FILTER
  const filtered = orders.filter((o) => {
    const matchSearch = Object.values(o).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
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

          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
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
          Pending: {orders.filter((o) => o.status === "Pending").length}
        </div>

        <div className="order-box green">
          Delivered: {orders.filter((o) => o.status === "Delivered").length}
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
              <tr key={`${o.id}-${o.status}`}>
                <td>{o.id}</td>
                <td>{o.supplier}</td>
                <td>{o.item}</td>
                <td>{o.qty}</td>
                <td>{o.status}</td>
                <td>{o.category}</td>

                <td>
                  <div className="order-actions-cell">
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

                    <button
                      className="order-table-btn"
                      onClick={() => deleteOrder(o.id)}
                    >
                      Cancel
                    </button>
                  </div>
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

              <input
                type="number"
                name="qty"
                value={form.qty}
                onChange={handleChange}
              />
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

              <input
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={handleChange}
              />
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={createOrder}>
                Save
              </button>

              <button className="close-btn" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
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
              <p>
                <b>ID:</b> {selectedOrder.id}
              </p>

              <p>
                <b>Supplier:</b> {selectedOrder.supplier}
              </p>

              <p>
                <b>Item:</b> {selectedOrder.item}
              </p>

              <p>
                <b>Qty:</b> {selectedOrder.qty}
              </p>

              <p>
                <b>Status:</b> {selectedOrder.status}
              </p>

              <p>
                <b>Category:</b> {selectedOrder.category}
              </p>

              <p>
                <b>Delivery Date:</b> {selectedOrder.deliveryDate}
              </p>
            </div>

            <div className="modal-buttons">
              <button className="close-btn" onClick={() => setShowView(false)}>
                Close
              </button>
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
                value={selectedOrder.supplier}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    supplier: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-group">
              <label>Item</label>

              <input
                value={selectedOrder.item}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    item: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-group">
              <label>Qty</label>

              <input
                type="number"
                value={selectedOrder.qty}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    qty: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-group">
              <label>Category</label>

              <select
                value={selectedOrder.category}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    category: e.target.value,
                  })
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
                value={selectedOrder.deliveryDate}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    deliveryDate: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={updateOrder}>
                Save
              </button>

              <button className="close-btn" onClick={() => setShowEdit(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;