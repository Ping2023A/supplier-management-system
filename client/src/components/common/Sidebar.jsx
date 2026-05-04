import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  const handleLogout = () => {
    // Clear token and role
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login"); // redirect to login
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to="/dashboard" end className={linkClass}>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/suppliers" className={linkClass}>
            Suppliers
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/orders" className={linkClass}>
            Orders
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/deliveries" className={linkClass}>
            Deliveries
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/reports" className={linkClass}>
            Reports
          </NavLink>
        </li>

        <li>
          <NavLink to="/dashboard/settings" className={linkClass}>
            Settings
          </NavLink>
        </li>
      </ul>

      {/* LOGOUT */}
      <div className="logout" onClick={handleLogout}>
        Log Out
      </div>
    </div>
  );
};

export default Sidebar;
