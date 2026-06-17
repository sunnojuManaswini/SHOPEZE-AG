import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import { SlidersHorizontal, ArrowUpDown, RefreshCcw } from "lucide-react";

const Products = () => {
  const { products, searchQuery, setSearchQuery } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States for filters
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState(400); // Max in default products is 300, so 400 is fine

  // Read URL search params
  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) {
      setCategory(catParam);
    }

    const filterParam = searchParams.get("filter");
    if (filterParam === "featured") {
      setSortBy("rating");
    } else if (filterParam === "trending") {
      setSortBy("reviews");
    }
  }, [searchParams]);

  // Reset all filters
  const handleResetFilters = () => {
    setCategory("All");
    setSortBy("default");
    setMaxPrice(400);
    setSearchQuery("");
    setSearchParams({});
  };

  // Categories list
  const categoriesList = ["All", "Electronics", "Accessories", "Home & Kitchen", "Apparel"];

  // Apply filters and sorting
  const filteredProducts = products
    .filter((product) => {
      // Category filter
      const matchCategory = category === "All" || product.category === category;
      // Search filter
      const matchSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      // Price filter
      const matchPrice = product.price <= maxPrice;

      return matchCategory && matchSearch && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "reviews") {
        return b.reviewCount - a.reviewCount;
      }
      return 0; // Default sorting (no change)
    });

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="section-header" style={{ marginBottom: "20px" }}>
        <div className="section-title" style={{ textAlign: "left" }}>
          <h2>Product Catalog</h2>
          <p style={{ color: "var(--text-light)", fontSize: "14px" }}>
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>
        
        {/* Sort Dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ArrowUpDown size={16} style={{ color: "var(--text-light)" }} />
          <select
            className="form-control"
            style={{ width: "180px", padding: "8px", borderRadius: "8px", fontSize: "14px" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default Sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="reviews">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
              <SlidersHorizontal size={16} /> Filters
            </h3>
            <button 
              onClick={handleResetFilters} 
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
            >
              <RefreshCcw size={12} /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Category</h4>
            <ul className="filter-list">
              {categoriesList.map((cat, idx) => (
                <li key={idx} className="filter-item">
                  <button
                    className={`filter-link-btn ${category === cat ? "active" : ""}`}
                    onClick={() => {
                      setCategory(cat);
                      setSearchParams(cat === "All" ? {} : { category: cat });
                    }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4 className="filter-title">Max Price</h4>
            <div style={{ padding: "0 8px" }}>
              <input
                type="range"
                min="10"
                max="400"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--primary)", cursor: "pointer" }}
              />
              <div className="filter-range-values">
                <span>Min: ₹10</span>
                <span style={{ fontWeight: 700, color: "var(--primary)" }}>Max: ₹{maxPrice}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Grid View */}
        <main style={{ flexGrow: 1 }}>
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <h3 style={{ color: "var(--text-muted)", marginBottom: "12px" }}>No products matched your criteria.</h3>
              <p style={{ color: "var(--text-light)" }}>Try checking your spelling, adjusting filters, or resetting terms.</p>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ marginTop: "16px" }}
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid" style={{ marginTop: "0" }}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
