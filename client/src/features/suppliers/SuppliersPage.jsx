import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/supplier.css";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    location: "",
    performance: "",
    status: "Active",
  });

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // FETCH SUPPLIERS
  useEffect(() => {
    axios
      .get(`${API_URL}/api/suppliers`, getAuthHeader())
      .then((res) => {
        const supplierData = res.data.data || res.data;
        setSuppliers(supplierData);
      })
      .catch((err) =>
        console.error("Fetch suppliers error:", err)
      );
  }, [API_URL]);

  // HANDLE INPUT
  const handleChange = (e) => {
    setNewSupplier({
      ...newSupplier,
      [e.target.name]: e.target.value,
    });
  };

  // ADD SUPPLIER
  const handleAddSupplier = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/suppliers`,
        newSupplier,
        getAuthHeader()
      );

      const savedSupplier = res.data.data || res.data;

      setSuppliers([savedSupplier, ...suppliers]);

      setShowAddModal(false);

      setNewSupplier({
        name: "",
        contact: "",
        location: "",
        performance: "",
        status: "Active",
      });
    } catch (err) {
      console.error("Add supplier error:", err);
    }
  };

  // VIEW
  const handleView = (supplier) => {
    setSelectedSupplier(supplier);
    setShowViewModal(true);
  };

  // EDIT
  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setShowEditModal(true);
  };

  // DELETE CLICK
  const handleDeleteClick = (index) => {
    setSelectedIndex(index);
    setShowDeleteModal(true);
  };

  // UPDATE SUPPLIER
  const handleUpdateSupplier = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/api/suppliers/${selectedSupplier._id}`,
        selectedSupplier,
        getAuthHeader()
      );

      const updatedSupplier = res.data.data || res.data;

      setSuppliers(
        suppliers.map((s) =>
          s._id === selectedSupplier._id
            ? updatedSupplier
            : s
        )
      );

      setShowEditModal(false);
    } catch (err) {
      console.error("Update supplier error:", err);
    }
  };

  // DELETE SUPPLIER
  const confirmDelete = async () => {
    try {
      const supplierToDelete = suppliers[selectedIndex];

      await axios.delete(
        `${API_URL}/api/suppliers/${supplierToDelete._id}`,
        getAuthHeader()
      );

      setSuppliers(
        suppliers.filter((_, i) => i !== selectedIndex)
      );

      setShowDeleteModal(false);
      setSelectedIndex(null);
    } catch (err) {
      console.error("Delete supplier error:", err);
    }
  };

  // FILTER
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch =
      String(s.name)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(s.contact)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(s.location)
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "" ||
      (filter === "Active" &&
        s.status === "Active") ||
      (filter === "At Risk" &&
        s.status === "At Risk");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="suppliers-page">
      {/* TOP */}
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
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            className="filter-dropdown"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="">Filter</option>

            <option value="Active">
              Active
            </option>

            <option value="At Risk">
              At Risk
            </option>
          </select>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="supplier-summary">
        <div className="supplier-box blue">
          Total Suppliers: {suppliers.length}
        </div>

        <div className="supplier-box green">
          Active Suppliers:{" "}
          {
            suppliers.filter(
              (s) => s.status === "Active"
            ).length
          }
        </div>

        <div className="supplier-box red">
          At-risk Suppliers:{" "}
          {
            suppliers.filter(
              (s) => s.status === "At Risk"
            ).length
          }
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
            {filteredSuppliers.map(
              (supplier, index) => (
                <tr
                  key={
                    supplier._id || index
                  }
                >
                  <td>{supplier.name}</td>

                  <td>
                    {supplier.contact}
                  </td>

                  <td>
                    {supplier.location}
                  </td>

                  <td>
                    {
                      supplier.performance
                    }
                  </td>

                  <td>
                    {supplier.status}
                  </td>

                  <td>
                    <div className="supplier-actions-cell">
                      <button
                        className="table-btn"
                        onClick={() =>
                          handleView(
                            supplier
                          )
                        }
                      >
                        View
                      </button>

                      <button
                        className="table-btn"
                        onClick={() =>
                          handleEdit(
                            supplier
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="table-btn delete-btn"
                        onClick={() =>
                          handleDeleteClick(
                            index
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add Supplier</h2>

            <input
              name="name"
              placeholder="Name"
              value={newSupplier.name}
              onChange={handleChange}
            />

            <input
              name="contact"
              placeholder="Contact"
              value={newSupplier.contact}
              onChange={handleChange}
            />

            <input
              name="location"
              placeholder="Location"
              value={newSupplier.location}
              onChange={handleChange}
            />

            <input
              name="performance"
              placeholder="Performance"
              value={
                newSupplier.performance
              }
              onChange={handleChange}
            />

            <select
              name="status"
              value={newSupplier.status}
              onChange={handleChange}
            >
              <option value="Active">
                Active
              </option>

              <option value="At Risk">
                At Risk
              </option>
            </select>

            <div className="modal-buttons">
              <button
                onClick={
                  handleAddSupplier
                }
              >
                Save
              </button>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal &&
        selectedSupplier && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>
                Supplier Details
              </h2>

              <p>
                <b>Name:</b>{" "}
                {
                  selectedSupplier.name
                }
              </p>

              <p>
                <b>Contact:</b>{" "}
                {
                  selectedSupplier.contact
                }
              </p>

              <p>
                <b>Location:</b>{" "}
                {
                  selectedSupplier.location
                }
              </p>

              <p>
                <b>Performance:</b>{" "}
                {
                  selectedSupplier.performance
                }
              </p>

              <p>
                <b>Status:</b>{" "}
                {
                  selectedSupplier.status
                }
              </p>

              <div className="modal-buttons">
                <button
                  onClick={() =>
                    setShowViewModal(
                      false
                    )
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      {/* EDIT MODAL */}
      {showEditModal &&
        selectedSupplier && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Edit Supplier</h2>

              <input
                value={
                  selectedSupplier.name
                }
                onChange={(e) =>
                  setSelectedSupplier({
                    ...selectedSupplier,
                    name:
                      e.target.value,
                  })
                }
              />

              <input
                value={
                  selectedSupplier.contact
                }
                onChange={(e) =>
                  setSelectedSupplier({
                    ...selectedSupplier,
                    contact:
                      e.target.value,
                  })
                }
              />

              <input
                value={
                  selectedSupplier.location
                }
                onChange={(e) =>
                  setSelectedSupplier({
                    ...selectedSupplier,
                    location:
                      e.target.value,
                  })
                }
              />

              <input
                value={
                  selectedSupplier.performance
                }
                onChange={(e) =>
                  setSelectedSupplier({
                    ...selectedSupplier,
                    performance:
                      e.target.value,
                  })
                }
              />

              <select
                value={
                  selectedSupplier.status
                }
                onChange={(e) =>
                  setSelectedSupplier({
                    ...selectedSupplier,
                    status:
                      e.target.value,
                  })
                }
              >
                <option value="Active">
                  Active
                </option>

                <option value="At Risk">
                  At Risk
                </option>
              </select>

              <div className="modal-buttons">
                <button
                  onClick={
                    handleUpdateSupplier
                  }
                >
                  Save
                </button>

                <button
                  onClick={() =>
                    setShowEditModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Delete</h2>

            <p>
              Are you sure you want to
              delete this supplier?
            </p>

            <div className="modal-buttons">
              <button
                className="delete-btn"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>

              <button
                onClick={() =>
                  setShowDeleteModal(
                    false
                  )
                }
              >
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