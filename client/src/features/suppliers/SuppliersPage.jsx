import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/supplier.css";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);

  // MODALS
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // SELECTED ITEMS
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // SEARCH + FILTER
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // FORM STATE
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    location: "",
    performance: "",
    status: "Active",
  });

  // FETCH DATA
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/suppliers")
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setNewSupplier({
      ...newSupplier,
      [e.target.name]: e.target.value,
    });
  };

  // ADD SUPPLIER
  const handleAddSupplier = () => {
    setSuppliers([...suppliers, newSupplier]);

    setNewSupplier({
      name: "",
      contact: "",
      location: "",
      performance: "",
      status: "Active",
    });

    setShowAddModal(false);
  };

  // VIEW MODAL
  const handleView = (supplier) => {
    setSelectedSupplier(supplier);
    setShowViewModal(true);
  };

  // DELETE MODAL OPEN
  const handleDeleteClick = (index) => {
    setSelectedIndex(index);
    setShowDeleteModal(true);
  };

  // CONFIRM DELETE
  const confirmDelete = () => {
    const updated = suppliers.filter((_, i) => i !== selectedIndex);
    setSuppliers(updated);

    setShowDeleteModal(false);
    setSelectedIndex(null);
  };

  // FILTER LOGIC
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "" ||
      (filter === "Active" && s.status === "Active") ||
      (filter === "At Risk" && s.status === "At Risk");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="suppliers-page">

      {/* TOP BAR */}
      <div className="supplier-top">
        <button
          className="add-supplier-btn"
          onClick={() => setShowAddModal(true)}
        >
          Add Supplier
        </button>

        <div className="supplier-actions">
          <input
            className="search-input"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-dropdown"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Filter</option>
            <option value="Active">Active</option>
            <option value="At Risk">At Risk</option>
          </select>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="supplier-summary">
        <div className="supplier-box blue">
          Total Suppliers: {suppliers.length}
        </div>

        <div className="supplier-box green">
          Active Suppliers: {suppliers.filter(s => s.status === "Active").length}
        </div>

        <div className="supplier-box red">
          At-risk Suppliers: {suppliers.filter(s => s.status === "At Risk").length}
        </div>
      </div>

      {/* TABLE */}
      <div className="supplier-table-wrapper">
        <table className="supplier-table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Performance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSuppliers.map((supplier, index) => (
              <tr key={index}>
                <td>{supplier.name}</td>
                <td>{supplier.contact}</td>
                <td>{supplier.location}</td>
                <td>{supplier.performance}</td>
                <td>{supplier.status}</td>
                <td>
                  <button
                    className="table-btn"
                    onClick={() => handleView(supplier)}
                  >
                    View
                  </button>

                  <button
                    className="table-btn delete-btn"
                    onClick={() => handleDeleteClick(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ADD MODAL ================= */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Supplier</h2>

            <input name="name" placeholder="Name" value={newSupplier.name} onChange={handleChange} />
            <input name="contact" placeholder="Contact" value={newSupplier.contact} onChange={handleChange} />
            <input name="location" placeholder="Location" value={newSupplier.location} onChange={handleChange} />
            <input name="performance" placeholder="Performance" value={newSupplier.performance} onChange={handleChange} />

            <select name="status" value={newSupplier.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="At Risk">At Risk</option>
            </select>

            <div className="modal-buttons">
              <button onClick={handleAddSupplier}>Save</button>
              <button onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW MODAL ================= */}
      {showViewModal && selectedSupplier && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Supplier Details</h2>

            <p><b>Name:</b> {selectedSupplier.name}</p>
            <p><b>Contact:</b> {selectedSupplier.contact}</p>
            <p><b>Location:</b> {selectedSupplier.location}</p>
            <p><b>Performance:</b> {selectedSupplier.performance}</p>
            <p><b>Status:</b> {selectedSupplier.status}</p>

            <div className="modal-buttons">
              <button onClick={() => setShowViewModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this supplier?</p>

            <div className="modal-buttons">
              <button className="delete-btn" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SuppliersPage;