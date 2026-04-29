import "../../styles/reports.css";

const ReportsPage = () => {
  const suppliers = [
    ["ABC Electronics", "John Carter", "New York, USA", "92%", "Active"],
    ["Global Textiles", "Sarah Lee", "Los Angeles, USA", "87%", "Active"],
    ["Nexa Solutions", "Michael Tan", "Toronto, Canada", "75%", "At Risk"],
  ];

  return (
    <div className="reports-page">
      {/* TOP */}
      <div className="reports-top">
        <button className="generate-report-btn">Generate Report</button>

        <div className="reports-actions">
          <span>🔍 Search</span>
          <span>Filter</span>
        </div>
      </div>

      {/* CHARTS */}
      <div className="reports-charts">
        <div className="chart-box">
          <h4>Supplier Performance</h4>
          <div className="chart-placeholder">Chart here</div>
        </div>

        <div className="chart-box">
          <h4>Demand Forecasting</h4>
          <div className="chart-placeholder">Chart here</div>
        </div>
      </div>

      {/* TABLE */}
      <h3 className="reports-title">Delivery List</h3>

      <div className="reports-table-wrapper">
        <table className="reports-table">
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
            {suppliers.map((s, i) => (
              <tr key={i}>
                <td>{s[0]}</td>
                <td>{s[1]}</td>
                <td>{s[2]}</td>
                <td>{s[3]}</td>
                <td>{s[4]}</td>
                <td>
                  <button className="report-btn">View</button>
                  <button className="report-btn">Delete</button>
                </td>
              </tr>
            ))}

            {Array.from({ length: 7 }).map((_, i) => (
              <tr key={i}>
                <td colSpan="6"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;