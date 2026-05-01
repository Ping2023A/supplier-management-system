import { useNavigate } from "react-router-dom";
import "../../styles/login.css";


const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // TEMP auth (later connect to backend)
    localStorage.setItem("isAuth", "true");

    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src="/logo.png" alt="logo" className="login-logo" />
        <h2>Supplier Management System</h2>

        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username or Email" required />
          <input type="password" placeholder="Password" required />

          <select required>
            <option value="">Select Role</option>
            <option>Admin</option>
            <option>Manager</option>
          </select>

          <div className="remember">
            <input type="checkbox" />
            <span>Remember Me</span>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <div className="login-links">
          <span>Forgot Password?</span>
          <span>Contact Admin</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;