import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      <div className="notfound-container">
        <div className="notfound-code">404</div>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-text">
          Oops! The page you are looking for does not exist or has been relocated. Return to the homepage or catalog to continue shopping.
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
          <Link to="/products" className="btn btn-secondary">
            Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
