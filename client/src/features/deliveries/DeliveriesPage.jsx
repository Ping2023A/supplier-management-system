import "../../styles/deliveries.css";

const DeliveriesPage = () => {
  const deliveries = [
    ["Shipment #469", "PO-1076", "ABC Electronics", "In Transit", "2024-04-02"],
    ["Shipment #465", "PO-1068", "Nexa Solutions", "Delivered", "2024-04-15"],
    ["Shipment #462", "PO-1058", "EastEnd Traders", "Delayed", "2024-04-14"],
  ];

  return (
    <div className="deliveries-page">
      <div className="deliveries-top">
        <button className="add-delivery-btn">Add Delivery</button>

        <div className="deliveries-actions">
          <span>🔍 Search</span>
          <span>Filter</span>
        </div>
      </div>

      <div className="deliveries-summary">
        <div className="delivery-box green">In Transit</div>
        <div className="delivery-box green">Delivered</div>
        <div className="delivery-box red">Delayed</div>
      </div>

      <h3 className="delivery-title">Delivery List</h3>

      <div className="deliveries-table-wrapper">
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
            {deliveries.map((delivery, index) => (
              <tr key={index}>
                <td>{delivery[0]}</td>
                <td>{delivery[1]}</td>
                <td>{delivery[2]}</td>
                <td>
                  <span className={`status-badge ${delivery[3].toLowerCase().replace(" ", "-")}`}>
                    {delivery[3]}
                  </span>
                </td>
                <td>{delivery[4]}</td>
                <td>
                  <button className="delivery-table-btn">View</button>
                  <button className="delivery-table-btn">Delete</button>
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

export default DeliveriesPage;