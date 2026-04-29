import "../../styles/orders.css";

const OrdersPage = () => {
  const orders = [
    ["PO-1045", "ABC Electronics", "Laptop Batteries", "25", "Pending"],
    ["PO-6776", "Global Textiles", "Uniform Fabric", "100", "Approved"],
    ["PO-0102", "Nexa Solutions", "Network Cables", "60", "In Transit"],
    ["PO-2201", "Prime Supplies", "Office Paper", "40", "Delivered"],
  ];

  return (
    <div className="orders-page">
      <div className="orders-top">
        <button className="add-order-btn">Create Order</button>

        <div className="orders-actions">
          <span>🔍 Search</span>
          <span>Filter</span>
        </div>
      </div>

      <div className="orders-summary">
        <div className="order-box blue">Total Orders</div>
        <div className="order-box orange">Pending Orders</div>
        <div className="order-box green">Completed Orders</div>
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
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order[0]}</td>
                <td>{order[1]}</td>
                <td>{order[2]}</td>
                <td>{order[3]}</td>
                <td>{order[4]}</td>
                <td>
                  <button className="order-table-btn">View</button>
                  <button className="order-table-btn">Cancel</button>
                </td>
              </tr>
            ))}

            {Array.from({ length: 7 }).map((_, index) => (
              <tr key={`empty-${index}`}>
                <td colSpan="6"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;