import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

// Inline brand SVGs since brand icons are removed in newer lucide-react versions
const Facebook = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const Twitter = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const Instagram = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const Github = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);



const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-brand">
          <h3>SHOPEZE</h3>
          <p>
            Your intelligent e-commerce and smart comparison platform. Find, compare, and shop high-fidelity electronics and accessories at the absolute best value.
          </p>
          <div className="footer-socials">
            <span className="footer-social-icon" aria-label="Facebook">
              <Facebook size={16} />
            </span>
            <span className="footer-social-icon" aria-label="Twitter">
              <Twitter size={16} />
            </span>
            <span className="footer-social-icon" aria-label="Instagram">
              <Instagram size={16} />
            </span>
            <span className="footer-social-icon" aria-label="GitHub">
              <Github size={16} />
            </span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-links">
          <h4>Shop Catalog</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/products">All Products</Link>
            </li>
            <li>
              <Link to="/products?category=Electronics">Electronics</Link>
            </li>
            <li>
              <Link to="/products?category=Accessories">Accessories</Link>
            </li>
            <li>
              <Link to="/products?category=Apparel">Apparel</Link>
            </li>
          </ul>
        </div>

        {/* Support Links Column */}
        <div className="footer-links">
          <h4>Platform</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/compare">Smart Compare</Link>
            </li>
            <li>
              <Link to="/cart">My Cart</Link>
            </li>
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>
            <li>
              <Link to="/profile">Profile & Orders</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription Column */}
        <div className="footer-newsletter">
          <h4 style={{ fontSize: "15px", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Newsletter
          </h4>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "15px" }}>
            Subscribe to receive product drops and discount coupons.
          </p>
          <form onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary btn-sm btn-block">
              {subscribed ? "Subscribed!" : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SHOPEZE. All rights reserved.</p>
        <p>Built with MERN Stack & Vanilla CSS</p>
      </div>
    </footer>
  );
};

export default Footer;
