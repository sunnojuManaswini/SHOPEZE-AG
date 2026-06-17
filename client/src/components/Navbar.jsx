import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  LayoutDashboard,
  CloudOff
} from "lucide-react";

const Navbar = () => {
  const { 
    cart, 
    wishlist, 
    currentUser, 
    logoutUser, 
    searchQuery, 
    setSearchQuery, 
    isOffline 
  } = useShop();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // If user is not on catalog page, redirect to catalog page
    if (location.pathname !== "/products") {
      navigate("/products");
    }
  };

  const handleLogout = () => {
    logoutUser();
    setDropdownOpen(false);
    navigate("/");
  };

  // Calculate cart badge items count
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="navbar" style={{ top: "0px" }}>
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
            <span>SHOPEZE</span>
          </Link>

          {/* Navigation Links */}
          <nav className={`navbar-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <NavLink 
              to="/" 
              className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
              end
            >
              Home
            </NavLink>
            <NavLink 
              to="/products" 
              className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </NavLink>
            <NavLink 
              to="/compare" 
              className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Compare
            </NavLink>
          </nav>

          {/* Search, Cart, Wishlist & Profile Actions */}
          <div className="navbar-actions">
            {/* Search Input */}
            <div className="navbar-search">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="navbar-search-icon" size={16} />
            </div>

            {/* Wishlist Link */}
            <Link to="/wishlist" className="icon-badge-btn" aria-label="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </Link>

            {/* Cart Link */}
            <Link to="/cart" className="icon-badge-btn" aria-label="Shopping Cart">
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && <span className="badge">{cartItemsCount}</span>}
            </Link>

            {/* Profile Dropdown */}
            {currentUser ? (
              <div className="navbar-user-menu">
                <button 
                  className="navbar-user-btn" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                >
                  <User size={16} />
                  <span style={{ maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} />
                </button>
                
                {dropdownOpen && (
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <User size={14} />
                      My Profile
                    </Link>
                    {currentUser.role === "admin" && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <LayoutDashboard size={14} />
                        Admin Panel
                      </Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout} style={{ width: "100%", background: "none", border: "none", textAlign: "left" }}>
                      <LogOut size={14} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button 
              className="menu-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
