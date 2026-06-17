import React from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Scale, Trash2, Award, Star, ShoppingCart, PlusCircle } from "lucide-react";

const Compare = () => {
  const { comparison, toggleCompare, clearCompare, addToCart } = useShop();

  const handleRemove = (product) => {
    toggleCompare(product);
  };

  // Evaluation algorithm to select the "Best Choice"
  const getBestChoice = () => {
    if (comparison.length < 2) return null;

    let bestProduct = null;
    let highestScore = -Infinity;
    let rationale = "";

    // Normalize values to compare
    // We compute scores for each product:
    // Score = (Rating * 10) + (100 - (Price / MaxPrice) * 50) + (Rating/Price * 100)
    const prices = comparison.map((p) => p.price);
    const maxPrice = Math.max(...prices);

    const scoredProducts = comparison.map((p) => {
      const priceScore = maxPrice > 0 ? (1 - p.price / maxPrice) * 10 : 10; // lower price is better
      const ratingScore = p.rating * 2; // higher rating is better
      const valueRatio = p.price > 0 ? p.rating / p.price : 0;
      const valueScore = valueRatio * 200; // rating relative to cost

      const totalScore = priceScore + ratingScore + valueScore;

      return {
        product: p,
        score: totalScore,
        priceScore,
        ratingScore,
        valueRatio,
      };
    });

    // Sort to find the highest score
    scoredProducts.sort((a, b) => b.score - a.score);
    const best = scoredProducts[0].product;
    
    // Determine rationale based on what made it best
    const isCheapest = comparison.every((p) => p.id === best.id || p.price > best.price);
    const isHighestRated = comparison.every((p) => p.id === best.id || p.rating < best.rating);

    if (isCheapest && isHighestRated) {
      rationale = "it has both the lowest price and the highest customer rating among your choices";
    } else if (isCheapest) {
      rationale = "it offers the lowest entry price while maintaining high specifications";
    } else if (isHighestRated) {
      rationale = "it has outstanding customer feedback and the highest overall quality rating";
    } else {
      rationale = "it offers the best balance of price, user feedback, and technical specifications";
    }

    return { product: best, rationale };
  };

  const bestChoice = getBestChoice();

  // Rating stars utility
  const renderStars = (rating) => {
    const stars = [];
    const val = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={12} 
          fill={i <= val ? "var(--warning)" : "none"} 
          color={i <= val ? "var(--warning)" : "var(--text-light)"} 
        />
      );
    }
    return stars;
  };

  if (comparison.length === 0) {
    return (
      <div className="notfound-container" style={{ animation: "fadeIn 0.5s ease-out" }}>
        <div className="notfound-code" style={{ fontSize: "80px" }}>
          <Scale size={80} style={{ color: "var(--primary)" }} />
        </div>
        <h2 className="notfound-title">Comparison Matrix is Empty</h2>
        <p className="notfound-text">
          Add products from the catalog to compare prices, technical specs, ratings, and get smart recommendations side-by-side.
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
          <h2>Product Comparison</h2>
          <p style={{ color: "var(--text-light)", fontSize: "14px" }}>
            Comparing {comparison.length} of max 3 products
          </p>
        </div>
        
        <button className="btn btn-secondary btn-sm" onClick={clearCompare}>
          <Trash2 size={14} /> Clear All
        </button>
      </div>

      {/* Best Choice Recommendation Banner */}
      {bestChoice && (
        <div 
          style={{
            background: "linear-gradient(135deg, var(--primary-glow), rgba(236, 72, 153, 0.05))",
            border: "1px solid var(--primary)",
            borderRadius: "var(--radius-md)",
            padding: "20px",
            marginBottom: "32px",
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            boxShadow: "var(--shadow-md)"
          }}
        >
          <div 
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              padding: "10px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Award size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
              Best Choice Recommendation
            </h3>
            <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>
              <strong>Recommended Product: {bestChoice.product.name}</strong> because {bestChoice.rationale}.
            </p>
          </div>
        </div>
      )}

      {/* Comparison Grid */}
      <div className="comparison-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="comparison-header-col">Product Details</th>
              {comparison.map((prod) => (
                <th key={prod.id} style={{ position: "relative" }}>
                  {bestChoice?.product.id === prod.id && (
                    <div 
                      style={{
                        position: "absolute",
                        top: "-12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "var(--success)",
                        color: "white",
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        boxShadow: "var(--shadow-sm)",
                        zIndex: 5
                      }}
                    >
                      Best Value Choice
                    </div>
                  )}
                  
                  <div className="comparison-product-card">
                    <button
                      onClick={() => handleRemove(prod)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "none",
                        border: "none",
                        color: "var(--danger)",
                        cursor: "pointer",
                        padding: "4px"
                      }}
                      title="Remove product"
                    >
                      <Trash2 size={16} />
                    </button>
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="comparison-product-img"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60";
                      }}
                    />
                    <div className="comparison-product-name">{prod.name}</div>
                  </div>
                </th>
              ))}
              {comparison.length < 3 && (
                <th style={{ backgroundColor: "var(--bg-base)", borderStyle: "dashed" }}>
                  <Link 
                    to="/products" 
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      color: "var(--text-light)",
                      padding: "40px 0"
                    }}
                  >
                    <PlusCircle size={28} />
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>Add Product</span>
                  </Link>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="comparison-header-col">Price</td>
              {comparison.map((prod) => (
                <td key={prod.id} style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-main)" }}>
                  ₹{prod.price.toLocaleString("en-IN")}
                </td>
              ))}
              {comparison.length < 3 && <td>-</td>}
            </tr>
            <tr>
              <td className="comparison-header-col">Rating</td>
              {comparison.map((prod) => (
                <td key={prod.id}>
                  <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginBottom: "4px" }}>
                    {renderStars(prod.rating)}
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-light)" }}>
                    {prod.rating} ({prod.reviewCount} reviews)
                  </span>
                </td>
              ))}
              {comparison.length < 3 && <td>-</td>}
            </tr>
            <tr>
              <td className="comparison-header-col">Brand</td>
              {comparison.map((prod) => (
                <td key={prod.id} style={{ fontWeight: 600 }}>
                  {prod.specs?.Brand || "Generic"}
                </td>
              ))}
              {comparison.length < 3 && <td>-</td>}
            </tr>
            <tr>
              <td className="comparison-header-col">Weight</td>
              {comparison.map((prod) => (
                <td key={prod.id}>{prod.specs?.Weight || "N/A"}</td>
              ))}
              {comparison.length < 3 && <td>-</td>}
            </tr>
            <tr>
              <td className="comparison-header-col">Color Options</td>
              {comparison.map((prod) => (
                <td key={prod.id}>{prod.specs?.Color || "N/A"}</td>
              ))}
              {comparison.length < 3 && <td>-</td>}
            </tr>
            <tr>
              <td className="comparison-header-col">Warranty</td>
              {comparison.map((prod) => (
                <td key={prod.id}>{prod.specs?.Warranty || "N/A"}</td>
              ))}
              {comparison.length < 3 && <td>-</td>}
            </tr>
            <tr>
              <td className="comparison-header-col">Description</td>
              {comparison.map((prod) => (
                <td 
                  key={prod.id} 
                  style={{ 
                    fontSize: "13px", 
                    color: "var(--text-muted)", 
                    maxWidth: "250px", 
                    textAlign: "justify",
                    lineHeight: "1.4"
                  }}
                >
                  {prod.description ? prod.description.substring(0, 100) + "..." : "No description."}
                </td>
              ))}
              {comparison.length < 3 && <td>-</td>}
            </tr>
            <tr>
              <td className="comparison-header-col">Action</td>
              {comparison.map((prod) => (
                <td key={prod.id}>
                  <button 
                    className="btn btn-primary btn-sm btn-block" 
                    onClick={() => addToCart(prod.id, 1)}
                    disabled={prod.stock <= 0}
                  >
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                </td>
              ))}
              {comparison.length < 3 && <td>-</td>}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
