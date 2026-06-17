import React from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Heart, Trash2, ShoppingCart, Scale } from "lucide-react";

const Wishlist = () => {
  const { wishlist, products, removeFromWishlist, moveToCart, toggleCompare, comparison } = useShop();

  // Find wishlist products details
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlist.length === 0) {
    return (
      <div className="notfound-container" style={{ animation: "fadeIn 0.5s ease-out" }}>
        <div className="notfound-code" style={{ fontSize: "80px" }}>
          <Heart size={80} style={{ color: "var(--text-light)" }} />
        </div>
        <h2 className="notfound-title">Your Wishlist is Empty</h2>
        <p className="notfound-text">
          Save your favorite products to your wishlist so you can keep track of them or move them directly to your cart later.
        </p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out", textAlign: "left" }}>
      <div className="section-header" style={{ marginBottom: "20px" }}>
        <div className="section-title">
          <h2>My Wishlist</h2>
          <p style={{ color: "var(--text-light)", fontSize: "14px" }}>
            You have saved {wishlistProducts.length} items in your wishlist
          </p>
        </div>
      </div>

      <div className="products-grid">
        {wishlistProducts.map((product) => {
          const isCompared = comparison.some((p) => p.id === product.id);
          return (
            <div key={product.id} className="product-card">
              <div style={{ position: "relative", overflow: "hidden", display: "block" }}>
                <span className="product-card-badge">{product.category}</span>
                
                {/* Remove from wishlist button */}
                <button
                  className="product-card-compare-btn active"
                  style={{ right: "56px" }}
                  onClick={() => removeFromWishlist(product.id)}
                  title="Remove from Wishlist"
                  aria-label="Remove from Wishlist"
                >
                  <Heart size={16} fill="var(--secondary)" color="var(--secondary)" />
                </button>

                {/* Compare toggle button */}
                <button
                  className={`product-card-compare-btn ${isCompared ? "active" : ""}`}
                  onClick={() => toggleCompare(product)}
                  title={isCompared ? "Remove from Compare" : "Add to Compare"}
                  aria-label="Compare"
                >
                  <Scale size={16} />
                </button>

                <img
                  src={product.image}
                  alt={product.name}
                  className="product-card-image"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60";
                  }}
                />
              </div>

              <div className="product-card-content">
                <span className="product-card-category">{product.specs?.Brand || "Generic"}</span>
                <Link to={`/products/${product.id}`}>
                  <h3 className="product-card-title">{product.name}</h3>
                </Link>

                <div style={{ display: "flex", gap: "2px", margin: "6px 0", color: "var(--warning)" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ fontSize: "12px" }}>
                      {i < Math.round(product.rating) ? "★" : "☆"}
                    </span>
                  ))}
                  <span style={{ fontSize: "12px", color: "var(--text-light)", marginLeft: "4px" }}>
                    ({product.reviewCount})
                  </span>
                </div>

                <div className="product-card-footer">
                  <span className="product-card-price">₹{product.price.toLocaleString("en-IN")}</span>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    onClick={() => moveToCart(product.id)}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart size={14} /> Move to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
