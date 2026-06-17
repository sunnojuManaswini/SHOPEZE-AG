const mongoose = require("mongoose");
const Product = require("../models/Product");
const User = require("../models/User");

// Seed data matching the initial products
const SEED_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    price: 299.99,
    rating: 4.8,
    reviewCount: 128,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    stock: 15,
    description: "Experience high-fidelity audio with active noise-cancellation, custom EQ settings, and up to 40 hours of battery life. Perfect for travel, work, and intense focus.",
    specs: { Brand: "Acoustix", Weight: "250g", Color: "Midnight Black", Warranty: "1 Year" }
  },
  {
    id: 2,
    name: "Smart Fitness Watch Pro",
    category: "Electronics",
    price: 199.99,
    rating: 4.5,
    reviewCount: 84,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    stock: 8,
    description: "Track your daily workouts, monitor your heart rate, sleep quality, and stay connected with call and notification alerts. Water-resistant up to 50m with a 7-day battery life.",
    specs: { Brand: "FitTech", Weight: "45g", Color: "Slate Gray", Warranty: "1 Year" }
  },
  {
    id: 3,
    name: "Minimalist Leather Wallet",
    category: "Accessories",
    price: 49.99,
    rating: 4.7,
    reviewCount: 56,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60",
    stock: 30,
    description: "Handcrafted from full-grain leather, this slim wallet features RFID-blocking technology and space for up to 8 cards plus cash. Fits perfectly in front pockets.",
    specs: { Brand: "Hide & Co", Weight: "30g", Color: "Tan Leather", Warranty: "Lifetime" }
  },
  {
    id: 4,
    name: "Ergonomic Mechanical Keyboard",
    category: "Electronics",
    price: 129.99,
    rating: 4.9,
    reviewCount: 92,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33faf9c1?w=500&auto=format&fit=crop&q=60",
    stock: 12,
    description: "Customizable RGB backlit mechanical keyboard with hot-swappable tactile brown switches. Ergonomic split layout helps reduce wrist strain for long typing sessions.",
    specs: { Brand: "Clicky", Weight: "950g", Color: "Chalk White", Warranty: "2 Years" }
  },
  {
    id: 5,
    name: "Modern Ceramic Coffee Mug",
    category: "Home & Kitchen",
    price: 24.99,
    rating: 4.4,
    reviewCount: 37,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60",
    stock: 25,
    description: "Double-walled insulated ceramic mug that keeps your beverage hot for hours. Ergonomic matte finish exterior and splash-proof slide lid.",
    specs: { Brand: "ClayWorks", Weight: "350g", Color: "Matte Gray", Warranty: "30 Days" }
  },
  {
    id: 6,
    name: "Cushioned Running Sneakers",
    category: "Apparel",
    price: 89.99,
    rating: 4.6,
    reviewCount: 73,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
    stock: 18,
    description: "Lightweight and breathable running shoes with ultra-responsive cushioning. Provides superior shock absorption and maximum energy return on tracks or roads.",
    specs: { Brand: "SwiftRun", Weight: "280g", Color: "Crimson Red", Warranty: "6 Months" }
  },
  {
    id: 7,
    name: "Waterproof Travel Backpack",
    category: "Accessories",
    price: 79.99,
    rating: 4.7,
    reviewCount: 65,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
    stock: 20,
    description: "Durable tear-resistant, waterproof backpack featuring a dedicated padded 15.6-inch laptop pocket, anti-theft back zippers, and USB charging port access.",
    specs: { Brand: "Nomad", Weight: "800g", Color: "Charcoal Black", Warranty: "1 Year" }
  },
  {
    id: 8,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 59.99,
    rating: 4.5,
    reviewCount: 49,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60",
    stock: 15,
    description: "Compact, rugged speaker with 360-degree sound. IPX7 waterproof rating makes it perfect for pool parties, camping, or hiking. Up to 12 hours playtime.",
    specs: { Brand: "BoomBox", Weight: "400g", Color: "Forest Green", Warranty: "1 Year" }
  }
];

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopeze";
    console.log(`Connecting to MongoDB at: ${connStr.split("@").pop()}...`); // Hide auth credentials in console
    
    // Connect with bufferCommands disabled to prevent query hangs during network failures
    const conn = await mongoose.connect(connStr, {
      bufferCommands: false
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed initial catalog products & test users
    await autoSeedDatabase();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn("Server running in database fallback mode.");
  }
};

const autoSeedDatabase = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("No products found in DB. Auto-seeding initial products...");
      await Product.insertMany(SEED_PRODUCTS);
      console.log("Products seeded successfully.");
    }

    // Seed test users
    const adminExists = await User.findOne({ email: "admin@shopeze.com" });
    if (!adminExists) {
      console.log("Auto-seeding default admin credentials...");
      await User.create({
        name: "Admin Shopeze",
        email: "admin@shopeze.com",
        password: "admin123",
        role: "admin",
      });
    }

    const customerExists = await User.findOne({ email: "user@shopeze.com" });
    if (!customerExists) {
      console.log("Auto-seeding default customer credentials...");
      await User.create({
        name: "John Doe",
        email: "user@shopeze.com",
        password: "user123",
        role: "customer",
        address: "123 Main St, Springfield",
      });
    }
  } catch (error) {
    console.error("Auto-seeding database failed:", error.message);
  }
};

module.exports = connectDB;
