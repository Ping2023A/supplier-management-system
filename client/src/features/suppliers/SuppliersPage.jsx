import "../../styles/supplier.css";

const SuppliersPage = () => {
  const suppliers = [
    ["ABC Electronics", "John Carter", "New York, USA", "92%", "Active"],
    ["Global Textiles", "Sarah Lee", "Los Angeles, USA", "87%", "Active"],
    ["Nexa Solutions", "Michael Tan", "Toronto, Canada", "75%", "At Risk"],
    ["Prime Supplies", "Anna Cruz", "Manila, PH", "81%", "Active"],
  ];

  return (
    <div className="suppliers-page">
      <div className="supplier-top">
        <button className="add-supplier-btn">Add Supplier</button>

        <div className="supplier-actions">
          <span>🔍 Search</span>
          <span>Filter</span>
        </div>
      </div>

      <div className="supplier-summary">
        <div className="supplier-box blue">Total Suppliers</div>
        <div className="supplier-box green">Active Suppliers</div>
        <div className="supplier-box red">
          At-risk Suppliers
          <span className="alert-icon">△</span>
        </div>
      </div>

      <div className="supplier-table-wrapper">
        <table className="supplier-table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Contact Person</th>
              <th>Location</th>
              <th>Performance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={index}>
                <td>{supplier[0]}</td>
                <td>{supplier[1]}</td>
                <td>{supplier[2]}</td>
                <td>{supplier[3]}</td>
                <td>{supplier[4]}</td>
                <td>
                  <button className="table-btn">View</button>
                  <button className="table-btn">Delete</button>
                </td>
              </tr>
            ))}

            {Array.from({ length: 7 }).map((_, index) => (
              <tr key={`empty-${index}`}>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuppliersPage;