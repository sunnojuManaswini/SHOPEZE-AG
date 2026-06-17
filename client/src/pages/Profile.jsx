import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { User, ShoppingBag, MapPin, Save, ShieldCheck } from "lucide-react";

const Profile = () => {
  const { currentUser, updateProfile, orders } = useShop();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile update fields
  const [name, setName] = useState(currentUser?.name || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Name cannot be empty.");
      return;
    }

    if (password) {
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
    }

    const payload = { name, address };
    if (password) {
      payload.password = password;
    }

    updateProfile(payload);
    setSuccessMsg("Profile updated successfully!");
    setPassword("");
    setConfirmPassword("");
    
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // Filter orders matching logged-in user
  const userOrders = orders.filter((order) => order.email === currentUser?.email);

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out", textAlign: "left" }}>
      <div className="section-header" style={{ marginBottom: "20px" }}>
        <div className="section-title">
          <h2>My Account</h2>
          <p style={{ color: "var(--text-light)", fontSize: "14px" }}>
            Welcome back, {currentUser?.name}! Manage your credentials and track purchases.
          </p>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar">
          <ul className="dashboard-menu">
            <li className="dashboard-menu-item">
              <button
                className={`dashboard-menu-btn ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <User size={16} /> Profile Details
              </button>
            </li>
            <li className="dashboard-menu-item">
              <button
                className={`dashboard-menu-btn ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                <ShoppingBag size={16} /> Order History ({userOrders.length})
              </button>
            </li>
          </ul>
        </aside>

        {/* Right Content Panel */}
        <main className="dashboard-content-panel">
          {activeTab === "profile" && (
            <div className="card">
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <User size={18} style={{ color: "var(--primary)" }} /> Personal Information
              </h3>

              {successMsg && (
                <div style={{ backgroundColor: "var(--success-glow)", color: "var(--success)", padding: "10px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", fontWeight: 600 }}>
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div style={{ backgroundColor: "var(--danger-glow)", color: "var(--danger)", padding: "10px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", fontWeight: 600 }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address (Disabled)</label>
                    <input
                      type="email"
                      className="form-control"
                      value={currentUser?.email}
                      disabled
                      style={{ opacity: 0.6, cursor: "not-allowed" }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Default Shipping Address</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter default street, city, postal code"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>

                <div style={{ borderTop: "1px solid var(--border-color)", marginTop: "20px", paddingTop: "20px" }}>
                  <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "16px", color: "var(--text-muted)" }}>
                    Update Password (Leave blank to keep current)
                  </h4>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                  <Save size={16} /> Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="card">
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <ShoppingBag size={18} style={{ color: "var(--primary)" }} /> Order History Log
              </h3>

              {userOrders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <p style={{ color: "var(--text-light)" }}>You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="management-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items Summary</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userOrders.map((order) => (
                        <tr key={order.id}>
                          <td style={{ fontWeight: 700, color: "var(--primary)" }}>{order.id}</td>
                          <td>{order.date}</td>
                          <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                            {order.items.map((it) => `${it.product.name} (x${it.quantity})`).join(", ")}
                          </td>
                          <td style={{ fontWeight: 600 }}>₹{order.totals.total.toLocaleString("en-IN")}</td>
                          <td>
                            <span 
                              className={`badge-status ${
                                order.status === "Pending" 
                                  ? "badge-pending" 
                                  : order.status === "Shipped" 
                                    ? "badge-shipped" 
                                    : "badge-delivered"
                              }`}
                              style={{
                                display: "inline-block",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: 700
                              }}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
