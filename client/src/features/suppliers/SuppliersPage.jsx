import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/supplier.css";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/suppliers")
      .then((res) => {
        setSuppliers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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
        <div className="supplier-box blue">
          Total Suppliers: {suppliers.length}
        </div>

        <div className="supplier-box green">
          Active Suppliers:{" "}
          {suppliers.filter((s) => s.status === "Active").length}
        </div>

        <div className="supplier-box red">
          At-risk Suppliers:{" "}
          {suppliers.filter((s) => s.status === "At Risk").length}
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
                <td>{supplier.name}</td>
                <td>{supplier.contact}</td>
                <td>{supplier.location}</td>
                <td>{supplier.performance}</td>
                <td>{supplier.status}</td>
                <td>
                  <button className="table-btn">View</button>
                  <button className="table-btn">Delete</button>
                </td>
              </tr>
            ))}

            {/* filler rows to keep layout */}
            {Array.from({ length: Math.max(0, 10 - suppliers.length) }).map(
              (_, index) => (
                <tr key={`empty-${index}`}>
                  <td colSpan="6"></td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuppliersPage;