import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Trash2, ShoppingBag, ArrowRight, Tag, X } from "lucide-react";

const Cart = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    applyCoupon, 
    removeCoupon, 
    activeCoupon, 
    getCartTotals 
  } = useShop();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    
    if (!couponCode.trim()) return;

    const result = applyCoupon(couponCode);
    if (result.success) {
      setCouponSuccess(result.message);
      setCouponCode("");
    } else {
      setCouponError(result.error);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess("");
    setCouponError("");
  };

  const handleCheckoutRedirect = () => {
    navigate("/checkout");
  };

  const totals = getCartTotals();

  if (cart.length === 0) {
    return (
      <div className="notfound-container" style={{ animation: "fadeIn 0.5s ease-out" }}>
        <div className="notfound-code" style={{ fontSize: "80px" }}>
          <ShoppingBag size={80} style={{ color: "var(--text-light)" }} />
        </div>
        <h2 className="notfound-title">Your Cart is Empty</h2>
        <p className="notfound-text">
          Looks like you haven't added anything to your shopping cart yet. Browse our premium collections to get started.
        </p>
        <Link to="/products" className="btn btn-primary">
          Shop Catalog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out", textAlign: "left" }}>
      <div className="section-header" style={{ marginBottom: "20px" }}>
        <div className="section-title">
          <h2>Shopping Cart</h2>
          <p style={{ color: "var(--text-light)", fontSize: "14px" }}>
            Manage items in your shopping cart before checkout
          </p>
        </div>
      </div>

      <div className="cart-layout">
        {/* Left Side: Cart Items Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="cart-items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.product.id}>
                  <td>
                    <div className="cart-item-info">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="cart-item-img"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60";
                        }}
                      />
                      <div>
                        <Link to={`/products/${item.product.id}`} className="cart-item-title">
                          {item.product.name}
                        </Link>
                        <div className="cart-item-category">{item.product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    ₹{item.product.price.toLocaleString("en-IN")}
                  </td>
                  <td className="cart-item-qty-cell">
                    <div className="quantity-selector">
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: "var(--text-main)" }}>
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </td>
                  <td>
                    <button
                      className="cart-item-action-btn"
                      onClick={() => removeFromCart(item.product.id)}
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ marginTop: "20px" }}>
            <Link to="/products" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "var(--primary)" }}>
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Side: Order Summary Panel */}
        <div>
          <div className="card cart-summary-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px" }}>
              Order Summary
            </h3>

            {/* Coupon Code Section */}
            <div className="coupon-section" style={{ flexDirection: "column", gap: "8px", borderBottom: "1px solid var(--border-color)", paddingBottom: "20px", marginBottom: "20px" }}>
              {!activeCoupon ? (
                <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "8px", width: "100%" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Coupon (SHOPSAVE10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ padding: "8px 12px", fontSize: "14px", flexGrow: 1 }}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: "8px 12px" }}>
                    Apply
                  </button>
                </form>
              ) : (
                <div 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    padding: "8px 12px", 
                    borderRadius: "var(--radius-sm)", 
                    backgroundColor: "var(--success-glow)", 
                    border: "1px dashed var(--success)",
                    width: "100%"
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--success)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Tag size={14} /> {activeCoupon.code} ({activeCoupon.discount * 100}% Off)
                  </span>
                  <button 
                    onClick={handleRemoveCoupon} 
                    style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", display: "flex", alignItems: "center" }}
                    title="Remove coupon"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {couponError && <p className="coupon-feedback" style={{ color: "var(--danger)" }}>{couponError}</p>}
              {couponSuccess && <p className="coupon-feedback" style={{ color: "var(--success)" }}>{couponSuccess}</p>}
            </div>

            {/* Summary details */}
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totals.subtotal.toLocaleString("en-IN")}</span>
            </div>
            
            {activeCoupon && (
              <div className="summary-row" style={{ color: "var(--success)", fontWeight: 600 }}>
                <span>Coupon Discount</span>
                <span>-₹{totals.discount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Estimated Shipping</span>
              <span>{totals.shipping === 0 ? "FREE" : `₹${totals.shipping.toLocaleString("en-IN")}`}</span>
            </div>

            <div className="summary-row">
              <span>Sales Tax (8%)</span>
              <span>₹{totals.tax.toLocaleString("en-IN")}</span>
            </div>

            {totals.shipping > 0 && (
              <p style={{ fontSize: "11px", color: "var(--text-light)", marginTop: "-8px", marginBottom: "12px" }}>
                Add ₹{(100 - (totals.subtotal - totals.discount)).toFixed(2)} more to unlock free shipping!
              </p>
            )}

            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{totals.total.toLocaleString("en-IN")}</span>
            </div>

            <button 
              className="btn btn-primary btn-block" 
              style={{ marginTop: "24px" }}
              onClick={handleCheckoutRedirect}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
