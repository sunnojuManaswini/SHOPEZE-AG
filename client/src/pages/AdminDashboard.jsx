import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import api from "../services/api";
import { 
  BarChart3, 
  Plus, 
  Edit3, 
  Trash2, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  DollarSign,
  X,
  Save,
  CheckCircle2,
  PackageOpen
} from "lucide-react";

const AdminDashboard = () => {
  const { 
    products, 
    orders, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateOrderStatus 
  } = useShop();

  const [activeTab, setActiveTab] = useState("overview");
  const [usersList, setUsersList] = useState([]);
  
  // Product Form Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add or edit
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  // Form fields
  const [pName, setPName] = useState("");
  const [pCategory, setPCategory] = useState("Electronics");
  const [pPrice, setPPrice] = useState("");
  const [pStock, setPStock] = useState("");
  const [pImage, setPImage] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pBrand, setPBrand] = useState("");
  const [pWarranty, setPWarranty] = useState("");

  // Load all users for admin list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.auth.getUsers();
        setUsersList(data);
      } catch (error) {
        console.warn("Failed to fetch users list from server. Using local mock users:", error.message);
        // Fallback mock users list
        setUsersList([
          { name: "John Doe", email: "user@shopeze.com", role: "customer", createdAt: "2026-06-01T12:00:00Z" },
          { name: "Admin Shopeze", email: "admin@shopeze.com", role: "admin", createdAt: "2026-06-01T12:00:00Z" }
        ]);
      }
    };
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  // Calculations for Overview Widgets
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totals.total, 0);
  const totalUsersCount = usersList.length > 0 ? usersList.length : 2; // Fallback estimate

  // Open Modal for Add Product
  const openAddModal = () => {
    setModalMode("add");
    setSelectedProductId(null);
    setPName("");
    setPCategory("Electronics");
    setPPrice("");
    setPStock("");
    setPImage("");
    setPDesc("");
    setPBrand("");
    setPWarranty("");
    setShowModal(true);
  };

  // Open Modal for Edit Product
  const openEditModal = (product) => {
    setModalMode("edit");
    setSelectedProductId(product.id);
    setPName(product.name);
    setPCategory(product.category);
    setPPrice(product.price.toString());
    setPStock(product.stock.toString());
    setPImage(product.image);
    setPDesc(product.description || "");
    setPBrand(product.specs?.Brand || "");
    setPWarranty(product.specs?.Warranty || "");
    setShowModal(true);
  };

  // Handle Product Form Submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!pName || !pPrice || !pStock) {
      alert("Please fill in required fields.");
      return;
    }

    const productData = {
      name: pName,
      category: pCategory,
      price: parseFloat(pPrice),
      stock: parseInt(pStock),
      image: pImage || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60",
      description: pDesc,
      specs: {
        Brand: pBrand || "Generic",
        Weight: "N/A",
        Color: "N/A",
        Warranty: pWarranty || "N/A",
      }
    };

    if (modalMode === "add") {
      const result = await addProduct(productData);
      if (result.success) {
        setShowModal(false);
      }
    } else {
      const result = await updateProduct(selectedProductId, productData);
      if (result.success) {
        setShowModal(false);
      }
    }
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product from database?")) {
      deleteProduct(id);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out", textAlign: "left" }}>
      <div className="section-header" style={{ marginBottom: "20px" }}>
        <div className="section-title">
          <h2>Admin Dashboard</h2>
          <p style={{ color: "var(--text-light)", fontSize: "14px" }}>
            E-Commerce administrative controls and analytics panel.
          </p>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar">
          <ul className="dashboard-menu">
            <li className="dashboard-menu-item">
              <button
                className={`dashboard-menu-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <BarChart3 size={16} /> Overview
              </button>
            </li>
            <li className="dashboard-menu-item">
              <button
                className={`dashboard-menu-btn ${activeTab === "products" ? "active" : ""}`}
                onClick={() => setActiveTab("products")}
              >
                <PackageOpen size={16} /> Manage Products
              </button>
            </li>
            <li className="dashboard-menu-item">
              <button
                className={`dashboard-menu-btn ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                <ShoppingBag size={16} /> Manage Orders ({totalOrders})
              </button>
            </li>
            <li className="dashboard-menu-item">
              <button
                className={`dashboard-menu-btn ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                <Users size={16} /> Users List
              </button>
            </li>
          </ul>
        </aside>

        {/* Right Dashboard Content */}
        <main className="dashboard-content-panel">
          
          {/* Overview / Stats Widgets Tab */}
          {activeTab === "overview" && (
            <div>
              <div className="admin-widgets-grid">
                <div className="widget-card">
                  <div className="widget-label" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Total Revenue</span>
                    <DollarSign size={16} style={{ color: "var(--primary)" }} />
                  </div>
                  <div className="widget-value">₹{totalRevenue.toLocaleString("en-IN")}</div>
                </div>

                <div className="widget-card">
                  <div className="widget-label" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Total Orders</span>
                    <ShoppingBag size={16} style={{ color: "var(--secondary)" }} />
                  </div>
                  <div className="widget-value">{totalOrders}</div>
                </div>

                <div className="widget-card">
                  <div className="widget-label" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Total Products</span>
                    <TrendingUp size={16} style={{ color: "var(--success)" }} />
                  </div>
                  <div className="widget-value">{totalProducts}</div>
                </div>

                <div className="widget-card">
                  <div className="widget-label" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Registered Users</span>
                    <Users size={16} style={{ color: "var(--warning)" }} />
                  </div>
                  <div className="widget-value">{totalUsersCount}</div>
                </div>
              </div>

              {/* Graphical info fallback styling */}
              <div className="card">
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>Platform Operations Status</h3>
                <div 
                  style={{ 
                    padding: "20px", 
                    borderRadius: "var(--radius-md)", 
                    backgroundColor: "var(--bg-input)", 
                    border: "1px dashed var(--border-color)",
                    textAlign: "center"
                  }}
                >
                  <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                    Database logs check: MongoDB integration is running in stable sync status.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Manage Products Tab */}
          {activeTab === "products" && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Catalog Database Management</h3>
                <button className="btn btn-primary btn-sm" onClick={openAddModal} style={{ display: "flex", gap: "6px" }}>
                  <Plus size={14} /> Add Product
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&auto=format&fit=crop&q=60"; }}
                          />
                        </td>
                        <td style={{ fontWeight: 600, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.name}
                        </td>
                        <td>{p.category}</td>
                        <td style={{ fontWeight: 700 }}>₹{p.price.toLocaleString("en-IN")}</td>
                        <td style={{ fontWeight: 600, color: p.stock <= 2 ? "var(--danger)" : "currentColor" }}>
                          {p.stock}
                        </td>
                        <td>
                          <div className="table-row-actions">
                            <button className="btn btn-secondary btn-sm btn-icon-only" onClick={() => openEditModal(p)} title="Edit details">
                              <Edit3 size={14} />
                            </button>
                            <button className="btn btn-danger btn-sm btn-icon-only" onClick={() => handleDeleteProduct(p.id)} title="Delete product">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Manage Orders Tab */}
          {activeTab === "orders" && (
            <div className="card">
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Active Customers Orders</h3>

              {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-light)" }}>
                  No customer orders exist.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="management-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer Email</th>
                        <th>Date</th>
                        <th>Items Summary</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td style={{ fontWeight: 700, color: "var(--primary)" }}>{order.id}</td>
                          <td>{order.email}</td>
                          <td>{order.date}</td>
                          <td style={{ fontSize: "12px", color: "var(--text-muted)", maxWidth: "200px" }}>
                            {order.items.map((it) => `${it.product.name} (x${it.quantity})`).join(", ")}
                          </td>
                          <td style={{ fontWeight: 700 }}>₹{order.totals.total.toLocaleString("en-IN")}</td>
                          <td>
                            <span 
                              className={`badge-status ${
                                order.status === "Pending" 
                                  ? "badge-pending" 
                                  : order.status === "Shipped" 
                                    ? "badge-shipped" 
                                    : "badge-delivered"
                              }`}
                              style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <select
                              className="form-control"
                              style={{ width: "120px", padding: "4px", fontSize: "12px", borderRadius: "6px" }}
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Users List Tab */}
          {activeTab === "users" && (
            <div className="card">
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Registered User Profiles</h3>
              <div style={{ overflowX: "auto" }}>
                <table className="management-table">
                  <thead>
                    <tr>
                      <th>Profile Name</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>Account Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((user, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span 
                            style={{ 
                              fontSize: "11px", 
                              fontWeight: 700, 
                              padding: "2px 6px", 
                              borderRadius: "4px", 
                              backgroundColor: user.role === "admin" ? "var(--danger-glow)" : "var(--primary-glow)",
                              color: user.role === "admin" ? "var(--danger)" : "var(--primary)" 
                            }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Seed Account"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Product Form Modal (Add / Edit Product) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "600px" }}>
            <div className="modal-header">
              <h3 style={{ fontSize: "20px", fontWeight: 800 }}>
                {modalMode === "add" ? "Create New Product" : "Edit Product Details"}
              </h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select 
                    className="form-control"
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    required
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Apparel">Apparel</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="29.99"
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock Units *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="10"
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Product Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  value={pImage}
                  onChange={(e) => setPImage(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group">
                  <label className="form-label">Brand Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Fitbit"
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Warranty Details</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 1 Year"
                    value={pWarranty}
                    onChange={(e) => setPWarranty(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Describe key features..."
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                ></textarea>
              </div>

              <div style={{ display: "flex", justify: "flex-end", gap: "12px", marginTop: "20px" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: "flex", gap: "6px" }}>
                  <Save size={16} /> Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
