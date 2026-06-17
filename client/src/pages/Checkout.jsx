import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { CreditCard, ShoppingBag, Truck, CheckCircle2, ArrowRight } from "lucide-react";

const Checkout = () => {
  const { cart, getCartTotals, placeOrder, currentUser } = useShop();
  
  // Shipping form states
  const [fullName, setFullName] = useState(currentUser?.name || "");
  const [address, setAddress] = useState(currentUser?.address || "");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderConfirmedId, setOrderConfirmedId] = useState(null);

  if (cart.length === 0 && !orderConfirmedId) {
    return <Navigate to="/cart" replace />;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!fullName.trim() || !address.trim() || !city.trim() || !postalCode.trim() || !phone.trim()) {
      setError("Please fill in all shipping fields.");
      setLoading(false);
      return;
    }

    const shippingInfo = { fullName, address, city, postalCode, phone };
    const result = await placeOrder(shippingInfo);
    setLoading(false);

    if (result.success) {
      setOrderConfirmedId(result.orderId);
    } else {
      setError(result.error);
    }
  };

  const totals = getCartTotals();

  // If order was placed, display the Order Confirmation page
  if (orderConfirmedId) {
    return (
      <div className="notfound-container" style={{ animation: "fadeIn 0.5s ease-out", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ color: "var(--success)", marginBottom: "20px" }}>
          <CheckCircle2 size={72} />
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "12px" }}>Order Confirmed!</h2>
        <p style={{ fontSize: "16px", color: "var(--text-muted)", marginBottom: "24px" }}>
          Thank you for shopping with SHOPEZE. Your order has been successfully placed.
        </p>

        <div className="card" style={{ padding: "20px", textAlign: "left", marginBottom: "32px", width: "100%" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "var(--text-main)", borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
            Receipt Details
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ color: "var(--text-muted)" }}>Order Reference:</span>
            <span style={{ fontWeight: 700, color: "var(--primary)" }}>{orderConfirmedId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ color: "var(--text-muted)" }}>Recipient:</span>
            <span style={{ fontWeight: 600 }}>{fullName}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ color: "var(--text-muted)" }}>Delivery Destination:</span>
            <span style={{ textAlign: "right", maxWidth: "250px", fontSize: "13px" }}>{address}, {city}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-color)", paddingTop: "12px", marginTop: "12px" }}>
            <span style={{ fontWeight: 700 }}>Paid Amount:</span>
            <span style={{ fontWeight: 800, color: "var(--text-main)" }}>₹{totals.total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <Link to="/profile" className="btn btn-primary" style={{ flexGrow: 1 }}>
            Track My Orders
          </Link>
          <Link to="/products" className="btn btn-secondary" style={{ flexGrow: 1 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out", textAlign: "left" }}>
      <div className="section-header" style={{ marginBottom: "20px" }}>
        <div className="section-title">
          <h2>Secure Checkout</h2>
          <p style={{ color: "var(--text-light)", fontSize: "14px" }}>
            Fill in your delivery details and finalize your order
          </p>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: "var(--danger-glow)", color: "var(--danger)", padding: "10px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", fontWeight: 600 }}>
          {error}
        </div>
      )}

      <div className="cart-layout">
        {/* Left Side: Shipping Address Form */}
        <form onSubmit={handlePlaceOrder}>
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Truck size={18} style={{ color: "var(--primary)" }} /> Shipping Destination
            </h3>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Recipient name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Street address, apartment, suite"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Springfield"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 100001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-color)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <CreditCard size={18} style={{ color: "var(--primary)" }} /> Payment Method
              </h3>
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-color)"
                }}
              >
                <input type="radio" id="cod" name="payment" defaultChecked style={{ marginRight: "12px", accentColor: "var(--primary)" }} />
                <label htmlFor="cod" style={{ fontWeight: 600, cursor: "pointer" }}>
                  Cash on Delivery (COD) / Pay on Delivery
                </label>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-light)", marginTop: "8px" }}>
                Pay safely at your doorstep using Cash, Cards, or UPI.
              </p>
            </div>
          </div>
        </form>

        {/* Right Side: Order Summary Panel */}
        <div>
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShoppingBag size={18} style={{ color: "var(--primary)" }} /> Order Summary
            </h3>
            
            {/* List of items */}
            <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "20px" }}>
              {cart.map((item) => (
                <div key={item.product.id} style={{ display: "flex", alignItems: "center", justifySpace: "between", gap: "12px", marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid var(--border-color)" }}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                  />
                  <div style={{ flexGrow: 1, textAlign: "left" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-light)" }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700 }}>
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="summary-row" style={{ fontSize: "14px" }}>
              <span>Subtotal</span>
              <span>₹{totals.subtotal.toLocaleString("en-IN")}</span>
            </div>

            {totals.discount > 0 && (
              <div className="summary-row" style={{ fontSize: "14px", color: "var(--success)" }}>
                <span>Discount</span>
                <span>-₹{totals.discount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="summary-row" style={{ fontSize: "14px" }}>
              <span>Shipping Fee</span>
              <span>{totals.shipping === 0 ? "FREE" : `₹${totals.shipping.toLocaleString("en-IN")}`}</span>
            </div>

            <div className="summary-row" style={{ fontSize: "14px" }}>
              <span>Sales Tax (8%)</span>
              <span>₹{totals.tax.toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row total" style={{ fontSize: "16px" }}>
              <span>Order Total</span>
              <span>₹{totals.total.toLocaleString("en-IN")}</span>
            </div>

            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: "24px" }}
              disabled={loading}
              onClick={handlePlaceOrder}
            >
              {loading ? "Processing..." : "Place Order"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
