import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">Supplier Management System</h2>

      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/suppliers"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Suppliers
          </NavLink>
        </li>

        <li>Orders</li>
        <li>Deliveries</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>

      <div className="logout">Log Out</div>
    </div>
  );
};

export default Sidebar;