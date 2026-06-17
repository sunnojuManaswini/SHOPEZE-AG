import React from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Star, ShoppingCart, Scale, Heart } from "lucide-react";

const ProductCard = ({ product }) => {
  const { 
    cart, 
    wishlist, 
    comparison, 
    addToCart, 
    toggleCompare, 
    addToWishlist, 
    removeFromWishlist 
  } = useShop();

  const isCompared = comparison.some((p) => p.id === product.id);
  const isWishlisted = wishlist.includes(product.id);
  const inCart = cart.some((item) => item.product.id === product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleCompareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  // Generate star array
  const stars = [];
  const ratingVal = Math.round(product.rating || 5);
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star 
        key={i} 
        size={14} 
        fill={i <= ratingVal ? "var(--warning)" : "none"} 
        color={i <= ratingVal ? "var(--warning)" : "var(--text-light)"} 
      />
    );
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} style={{ display: "block", overflow: "hidden", position: "relative" }}>
        {/* Category Badge */}
        {product.stock <= 0 ? (
          <span className="product-card-badge" style={{ backgroundColor: "var(--danger)" }}>
            Out of Stock
          </span>
        ) : product.stock <= 5 ? (
          <span className="product-card-badge" style={{ backgroundColor: "var(--warning)" }}>
            Only {product.stock} Left
          </span>
        ) : (
          <span className="product-card-badge">{product.category}</span>
        )}

        {/* Wishlist Button (Heart) */}
        <button
          className={`product-card-compare-btn ${isWishlisted ? "active" : ""}`}
          style={{ right: "56px" }}
          onClick={handleWishlistToggle}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist"
        >
          <Heart size={16} fill={isWishlisted ? "var(--secondary)" : "none"} color={isWishlisted ? "var(--secondary)" : "currentColor"} />
        </button>

        {/* Compare Button (Scale) */}
        <button
          className={`product-card-compare-btn ${isCompared ? "active" : ""}`}
          onClick={handleCompareToggle}
          title={isCompared ? "Remove from Comparison" : "Add to Comparison"}
          aria-label="Compare"
        >
          <Scale size={16} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60";
          }}
        />
      </Link>

      <div className="product-card-content">
        <span className="product-card-category">{product.specs?.Brand || "Brand"}</span>
        <Link to={`/products/${product.id}`}>
          <h3 className="product-card-title">{product.name}</h3>
        </Link>

        {/* Rating Section */}
        <div className="product-card-rating">
          {stars}
          <span>({product.reviewCount || 0})</span>
        </div>

        {/* Footer with Price and Add To Cart */}
        <div className="product-card-footer">
          <span className="product-card-price">₹{product.price.toLocaleString("en-IN")}</span>
          <button
            className="btn btn-primary btn-sm btn-icon-only"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            title="Add to Cart"
            aria-label="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
