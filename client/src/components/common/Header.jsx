import logo from "../../assets/logos/logo.png";
import adminAvatar from "../../assets/images/admin.png";

const Header = () => {
  return (
    <div className="header">
      <div className="brand">
        <img src={logo} alt="Logo" className="brand-logo" />
        <h1>Supplier Management System</h1>
      </div>

      <div className="admin-info">
        <span>
          Welcome, <strong>Admin</strong>
        </span>
        <img src={adminAvatar} alt="Admin" className="admin-avatar" />
      </div>
    </div>
  );
};

export default Header;