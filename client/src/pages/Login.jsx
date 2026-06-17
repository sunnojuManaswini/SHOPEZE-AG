import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { LogIn, UserCheck, ShieldAlert, Key } from "lucide-react";

const Login = () => {
  const { loginUser } = useShop();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const result = await loginUser(email, password);
    setLoading(false);
    
    if (result.success) {
      navigate(redirect);
    } else {
      setError(result.error);
    }
  };

  // Helper shortcut test credentials
  const handleShortcutLogin = async (role) => {
    setError("");
    setLoading(true);
    let uEmail = "";
    let uPass = "";

    if (role === "customer") {
      uEmail = "user@shopeze.com";
      uPass = "user123";
    } else {
      uEmail = "admin@shopeze.com";
      uPass = "admin123";
    }

    setEmail(uEmail);
    setPassword(uPass);

    const result = await loginUser(uEmail, uPass);
    setLoading(false);
    
    if (result.success) {
      navigate(role === "admin" ? "/admin" : redirect);
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="auth-container">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your premium shopping session</p>
        </div>

        {error && (
          <div style={{ backgroundColor: "var(--danger-glow)", color: "var(--danger)", padding: "10px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* Shortcut Testing Credentials Box */}
        <div className="auth-shortcut-box">
          <p>Quick Reviewer Shortcuts</p>
          <div className="auth-shortcut-btns">
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => handleShortcutLogin("customer")}
              style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <UserCheck size={12} /> Test Customer
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => handleShortcutLogin("admin")}
              style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              <ShieldAlert size={12} /> Test Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. user@shopeze.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ display: "flex", gap: "8px" }}>
            <LogIn size={16} /> {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
