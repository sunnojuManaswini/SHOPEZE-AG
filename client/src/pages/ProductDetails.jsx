import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Star, ShoppingCart, Scale, Heart, ArrowLeft, CheckCircle2, AlertOctagon } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const { 
    products, 
    cart, 
    wishlist, 
    comparison, 
    addToCart, 
    toggleCompare, 
    addToWishlist, 
    removeFromWishlist 
  } = useShop();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  
  // Review form states
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [localReviews, setLocalReviews] = useState([
    { author: "Sarah Jenkins", rating: 5, comment: "Absolutely incredible! The quality exceeded my expectations. Highly recommended.", date: "May 12, 2026" },
    { author: "Mark Robertson", rating: 4, comment: "Really solid build. Works exactly as described, though shipping took an extra day.", date: "June 2, 2026" }
  ]);

  useEffect(() => {
    const found = products.find((p) => p.id === Number(id));
    if (found) {
      setProduct(found);
      setQuantity(1);
    }
  }, [id, products]);

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h3>Product not found.</h3>
        <Link to="/products" className="btn btn-primary btn-sm" style={{ marginTop: "16px" }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isCompared = comparison.some((p) => p.id === product.id);
  const isWishlisted = wishlist.includes(product.id);
  const inCart = cart.find((item) => item.product.id === product.id);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const incrementQty = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewAuthor.trim() && reviewComment.trim()) {
      const newReview = {
        author: reviewAuthor,
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      };
      setLocalReviews([newReview, ...localReviews]);
      setReviewAuthor("");
      setReviewComment("");
      setReviewRating(5);
    }
  };

  // Generate star ratings
  const renderStars = (rating) => {
    const stars = [];
    const val = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          fill={i <= val ? "var(--warning)" : "none"} 
          color={i <= val ? "var(--warning)" : "var(--text-light)"} 
        />
      );
    }
    return stars;
  };

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      {/* Back button */}
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <Link to="/products" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "var(--text-muted)" }}>
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>

      {/* Main product detail section */}
      <div className="product-detail-layout">
        {/* Left Side: Product Gallery */}
        <div className="gallery-container">
          <div className="main-image-view">
            <img 
              src={product.image} 
              alt={product.name} 
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60";
              }}
            />
          </div>
          {/* Thumbnails grid */}
          <div className="thumbnails-grid">
            <div className="thumbnail-item active">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="thumbnail-item">
              <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=60" alt="Alternate 1" />
            </div>
            <div className="thumbnail-item">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=60" alt="Alternate 2" />
            </div>
            <div className="thumbnail-item">
              <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=60" alt="Alternate 3" />
            </div>
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="product-info-panel">
          <span className="product-detail-category">{product.category}</span>
          <h2 className="product-detail-title">{product.name}</h2>
          
          <div className="product-detail-meta">
            <div style={{ display: "flex", gap: "2px" }}>
              {renderStars(product.rating)}
            </div>
            <span style={{ fontSize: "14px", color: "var(--text-light)" }}>
              {product.rating} ({product.reviewCount + localReviews.length - 2} reviews)
            </span>
            
            <div className="dropdown-divider" style={{ width: "1px", height: "14px", margin: "0 8px", display: "inline-block", backgroundColor: "var(--border-color)" }}></div>
            
            {product.stock > 0 ? (
              <span className="stock-status in-stock">
                <CheckCircle2 size={14} /> In Stock ({product.stock} units)
              </span>
            ) : (
              <span className="stock-status out-of-stock">
                <AlertOctagon size={14} /> Out of Stock
              </span>
            )}
          </div>

          <div className="product-detail-price">
            ₹{product.price.toLocaleString("en-IN")}
          </div>

          <p className="product-detail-description">
            {product.description || "No description provided for this product. High-fidelity craftsmanship and material durability are standard traits of our selected products catalog."}
          </p>

          {/* Add to Cart Controls */}
          {product.stock > 0 && (
            <div className="product-detail-purchase-row">
              <div className="quantity-selector">
                <button onClick={decrementQty} disabled={quantity <= 1}>-</button>
                <span>{quantity}</span>
                <button onClick={incrementQty} disabled={quantity >= product.stock}>+</button>
              </div>

              <button 
                className="btn btn-primary" 
                onClick={handleAddToCart}
                style={{ flexGrow: 1 }}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          )}

          {/* Extra utility row */}
          <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", alignItems: "center", gap: "8px", flexGrow: 1 }}
              onClick={handleWishlistToggle}
            >
              <Heart size={16} fill={isWishlisted ? "var(--secondary)" : "none"} color={isWishlisted ? "var(--secondary)" : "currentColor"} />
              {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </button>

            <button
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", alignItems: "center", gap: "8px", flexGrow: 1 }}
              onClick={() => toggleCompare(product)}
            >
              <Scale size={16} color={isCompared ? "var(--primary)" : "currentColor"} />
              {isCompared ? "Compared" : "Add to Compare"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <section className="details-tabs-container">
        <div className="tabs-nav">
          <button 
            className={`tab-btn ${activeTab === "specs" ? "active" : ""}`}
            onClick={() => setActiveTab("specs")}
          >
            Specifications
          </button>
          <button 
            className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews ({localReviews.length})
          </button>
        </div>

        {/* Specifications Tab Content */}
        {activeTab === "specs" && (
          <div className="tab-content-panel">
            <table className="specs-table">
              <tbody>
                <tr>
                  <td>Brand</td>
                  <td>{product.specs?.Brand || "Generic"}</td>
                </tr>
                <tr>
                  <td>Weight</td>
                  <td>{product.specs?.Weight || "N/A"}</td>
                </tr>
                <tr>
                  <td>Color</td>
                  <td>{product.specs?.Color || "N/A"}</td>
                </tr>
                <tr>
                  <td>Warranty</td>
                  <td>{product.specs?.Warranty || "N/A"}</td>
                </tr>
                <tr>
                  <td>Category</td>
                  <td>{product.category}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Reviews Tab Content */}
        {activeTab === "reviews" && (
          <div className="tab-content-panel">
            <div className="reviews-summary">
              <div className="reviews-summary-card">
                <div className="reviews-summary-number">{product.rating}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: "2px", margin: "8px 0" }}>
                  {renderStars(product.rating)}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-light)" }}>Product Average Rating</div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "4px" }}>
                <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>100% Verified Customer Testimonials</p>
                <p style={{ fontSize: "13px", color: "var(--text-light)" }}>Only registered clients can submit reviews.</p>
              </div>
            </div>

            {/* List of reviews */}
            <div style={{ marginBottom: "40px" }}>
              {localReviews.map((rev, idx) => (
                <div key={idx} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{rev.author}</span>
                    <span className="review-date">{rev.date}</span>
                  </div>
                  <div style={{ display: "flex", gap: "2px", margin: "4px 0" }}>
                    {renderStars(rev.rating)}
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Review form */}
            <div className="review-form">
              <h4 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Write a Review</h4>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter your name" 
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <div className="star-rating-select">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star}
                        className={star <= reviewRating ? "selected" : ""}
                        onClick={() => setReviewRating(star)}
                        style={{ cursor: "pointer" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea 
                    className="form-control" 
                    rows="4" 
                    placeholder="Describe your experience with this product" 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-sm">
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetails;
