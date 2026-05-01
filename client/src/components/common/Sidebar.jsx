import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  const handleLogout = () => {
    localStorage.removeItem("isAuth"); // clear login
    navigate("/login"); // redirect to login
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/suppliers" className={linkClass}>
            Suppliers
          </NavLink>
        </li>

        <li>
          <NavLink to="/orders" className={linkClass}>
            Orders
          </NavLink>
        </li>

        <li>
          <NavLink to="/deliveries" className={linkClass}>
            Deliveries
          </NavLink>
        </li>

        <li>
          <NavLink to="/reports" className={linkClass}>
            Reports
          </NavLink>
        </li>

        <li>
          <NavLink to="/settings" className={linkClass}>
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