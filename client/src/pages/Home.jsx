import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import { 
  Scale, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  Laptop, 
  Watch, 
  Home as HomeIcon, 
  Shirt,
  ArrowRight
} from "lucide-react";
import heroImg from "../assets/hero.png";

const Home = () => {
  const { products } = useShop();
  const navigate = useNavigate();

  // Get Featured Products (Rating >= 4.7)
  const featuredProducts = products
    .filter((p) => p.rating >= 4.7)
    .slice(0, 4);

  // Get Trending Products (Sorted by Review Count)
  const trendingProducts = [...products]
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    .slice(0, 4);

  const categories = [
    { name: "Electronics", icon: <Laptop size={28} />, count: products.filter(p => p.category === "Electronics").length },
    { name: "Accessories", icon: <Watch size={28} />, count: products.filter(p => p.category === "Accessories").length },
    { name: "Home & Kitchen", icon: <HomeIcon size={28} />, count: products.filter(p => p.category === "Home & Kitchen").length },
    { name: "Apparel", icon: <Shirt size={28} />, count: products.filter(p => p.category === "Apparel").length },
  ];

  return (
    <div style={{ animation: "fadeIn 0.5s ease-out" }}>
      {/* Hero Section */}
      <section className="hero-section">
        <div style={{ textAlign: "left" }}>
          <div className="hero-tagline">Shop Smart, Buy Easy</div>
          <h1 className="hero-title">
            Find the Best Deals With <span>Smart Compare</span>
          </h1>
          <p className="hero-description">
            SHOPEZE helps you discover, compare side-by-side, and buy premium products. 
            Analyze prices, reviews, specs and get automated best-choice recommendations instantly.
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">
              Explore Products <ArrowRight size={16} />
            </Link>
            <Link to="/compare" className="btn btn-secondary">
              Compare Specs
            </Link>
          </div>
        </div>
        <div className="hero-image-container">
          <img 
            src={heroImg} 
            alt="Shopeze Premium Experience" 
            className="hero-img"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60";
            }}
          />
        </div>
      </section>

      {/* Brand Value Propositions */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">
            <Scale size={20} />
          </div>
          <h3 className="feature-title">Smart Compare</h3>
          <p className="feature-desc">Compare up to 3 products side-by-side to make the absolute best value choice.</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">
            <ShieldCheck size={20} />
          </div>
          <h3 className="feature-title">Secure Checkout</h3>
          <p className="feature-desc">100% verified payments and credentials protection using encrypted JWT.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Truck size={20} />
          </div>
          <h3 className="feature-title">Fast Shipping</h3>
          <p className="feature-desc">Free delivery on orders over ₹100, dispatched with live tracking updates.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <Headphones size={20} />
          </div>
          <h3 className="feature-title">24/7 Support</h3>
          <p className="feature-desc">Direct support for returns, queries, and checkout assistance anytime.</p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="category-section">
        <div className="section-header">
          <div className="section-title">
            <h2>Shop By Category</h2>
          </div>
        </div>
        <div className="category-grid">
          {categories.map((cat, index) => (
            <div 
              key={index} 
              className="category-card"
              onClick={() => navigate(`/products?category=${cat.name}`)}
            >
              <div className="category-card-icon" style={{ color: "var(--primary)" }}>
                {cat.icon}
              </div>
              <div className="category-card-title">{cat.name}</div>
              <div style={{ fontSize: "12px", color: "var(--text-light)", marginTop: "4px" }}>
                {cat.count} items
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ marginBottom: "60px" }}>
        <div className="section-header">
          <div className="section-title">
            <h2>Featured Products</h2>
          </div>
          <Link to="/products?filter=featured" className="navbar-link" style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
            See All Featured <ArrowRight size={16} />
          </Link>
        </div>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section style={{ marginBottom: "20px" }}>
        <div className="section-header">
          <div className="section-title">
            <h2>Trending Products</h2>
          </div>
          <Link to="/products?filter=trending" className="navbar-link" style={{ display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
            See All Trending <ArrowRight size={16} />
          </Link>
        </div>
        <div className="products-grid">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
