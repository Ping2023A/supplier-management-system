import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/login.css";
import logo from "../../assets/logos/logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // ✅ modal state
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        if (res.data.role) {
          localStorage.setItem("role", res.data.role);
        }
        navigate("/dashboard");
      } else {
        setError(res.data.error || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetMessage("");
    setResetError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email: resetEmail,
      });

      if (res.data.success) {
        setResetMessage("Reset link sent to your email.");
      } else {
        setResetError(res.data.error || "Unable to send reset link.");
      }
    } catch (err) {
      setResetError(err.response?.data?.error || "Server error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={logo} alt="logo" className="login-logo" />
        <h2>Supplier Management System</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Remember Me + Forgot Password in one row */}
          <div className="login-options">
            <div className="remember">
              <input type="checkbox" />
              <span>Remember Me</span>
            </div>
            <span
              className="forgot-link"
              onClick={() => setShowModal(true)} // ✅ open modal
            >
              Forgot Password?
            </span>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* ✅ Forgot Password Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reset Password</h3>
            <form onSubmit={handleReset}>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button type="submit" className="reset-btn">
                Send Reset Link
              </button>
            </form>
            {resetMessage && <p style={{ color: "lightgreen" }}>{resetMessage}</p>}
            {resetError && <p style={{ color: "red" }}>{resetError}</p>}
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
