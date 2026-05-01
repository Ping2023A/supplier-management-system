import { useState } from "react";
import "../../styles/orders.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([
    ["PO-1045", "ABC Electronics", "Laptop Batteries", "25", "Pending"],
    ["PO-6776", "Global Textiles", "Uniform Fabric", "100", "Approved"],
    ["PO-0102", "Nexa Solutions", "Network Cables", "60", "In Transit"],
    ["PO-2201", "Prime Supplies", "Office Paper", "40", "Delivered"],
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setsearchTerm] = useState("");
  const [newOrder, setNewOrder] = useState({
    supplier: "",
    item: "",
    quantity: "",
    status: "Pending",
  });

  const handleInputChange = (e) => {
    setNewOrder({
      ...newOrder,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateOrder = () => {
    if (
      !newOrder.supplier ||
      !newOrder.item ||
      !newOrder.quantity
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const randomId = `PO-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const orderToAdd = [
      randomId,
      newOrder.supplier,
      newOrder.item,
      newOrder.quantity,
      newOrder.status,
    ];

    setOrders([orderToAdd, ...orders]);

    setNewOrder({
      supplier: "",
      item: "",
      quantity: "",
      status: "Pending",
    });

    setShowModal(false);
  };

  const handleCancelOrder = (indexToRemove) => {
    setOrders(
      orders.filter((_, index) => index !== indexToRemove)
    );
  };

  const filteredOrders = orders.filter((order) =>
  order.some((field) =>
    field
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
);

  return (
    <div className="orders-page">
      <div className="orders-top">
        <button
          className="add-order-btn"
          onClick={() => setShowModal(true)}
        >
          Create Order
        </button>

        <div className="orders-actions">
          <input
            type="text"
            placeholder="Search orders..."
            className="search-input"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
          <span>Filter</span>
        </div>
      </div>

      <div className="orders-summary">
        <div className="order-box blue">
          Total Orders: {orders.length}
        </div>

        <div className="order-box orange">
          Pending Orders:{" "}
          {
            orders.filter(
              (order) => order[4] === "Pending"
            ).length
          }
        </div>

        <div className="order-box green">
          Completed Orders:{" "}
          {
            orders.filter(
              (order) => order[4] === "Delivered"
            ).length
          }
        </div>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Supplier</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={index}>
                <td>{order[0]}</td>
                <td>{order[1]}</td>
                <td>{order[2]}</td>
                <td>{order[3]}</td>
                <td>{order[4]}</td>

                <td>
                  <button
                    className="order-table-btn"
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowViewModal(true);
                    }}
                  >
                    View
                  </button>

                  <button
                    className="order-table-btn"
                    onClick={() =>
                      handleCancelOrder(index)
                    }
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}

            {Array.from({
              length: Math.max(0, 7 - orders.length),
            }).map((_, index) => (
              <tr key={`empty-${index}`}>
                <td colSpan="6"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE ORDER MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="order-modal">
            <h2>Create Order</h2>

            <div className="modal-group">
              <label>Supplier</label>

              <input
                type="text"
                name="supplier"
                placeholder="Enter supplier name"
                value={newOrder.supplier}
                onChange={handleInputChange}
              />
            </div>

            <div className="modal-group">
              <label>Item</label>

              <input
                type="text"
                name="item"
                placeholder="Enter item name"
                value={newOrder.item}
                onChange={handleInputChange}
              />
            </div>

            <div className="modal-group">
              <label>Quantity</label>

              <input
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                value={newOrder.quantity}
                onChange={handleInputChange}
              />
            </div>

            <div className="modal-group">
              <label>Status</label>

              <select
                name="status"
                value={newOrder.status}
                onChange={handleInputChange}
              >
                <option>Pending</option>
                <option>Approved</option>
                <option>In Transit</option>
                <option>Delivered</option>
              </select>
            </div>

            <div className="modal-buttons">
              <button
                className="save-btn"
                onClick={handleCreateOrder}
              >
                Save Order
              </button>

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW ORDER MODAL */}
      {showViewModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="order-modal">
            <h2>Order Details</h2>

            <div className="view-order-details">
              <p>
                <strong>Order ID:</strong>{" "}
                {selectedOrder[0]}
              </p>

              <p>
                <strong>Supplier:</strong>{" "}
                {selectedOrder[1]}
              </p>

              <p>
                <strong>Item:</strong>{" "}
                {selectedOrder[2]}
              </p>

              <p>
                <strong>Quantity:</strong>{" "}
                {selectedOrder[3]}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedOrder[4]}
              </p>

              <p>
                <strong>Order Date:</strong>{" "}
                2026-05-01
              </p>

              <p>
                <strong>Delivery Date:</strong>{" "}
                Awaiting Delivery
              </p>
            </div>

            <div className="modal-buttons">
              <button
                className="close-btn"
                onClick={() =>
                  setShowViewModal(false)
                }
              >
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