const Product = require("../models/Product");

// Seed data matching the initial frontend products
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

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID (supports numeric ID and mongo ObjectId)
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const idParam = req.params.id;
    let product;

    // Check if parameter is numeric
    if (!isNaN(idParam)) {
      product = await Product.findOne({ id: Number(idParam) });
    }

    // Fallback to searching by Mongo ObjectId
    if (!product && idParam.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idParam);
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const addProduct = async (req, res, next) => {
  try {
    const { name, category, price, stock, description, image, specs } = req.body;

    // Auto-generate numeric ID
    const maxProduct = await Product.findOne({}).sort("-id");
    const nextId = maxProduct ? maxProduct.id + 1 : 1;

    const product = new Product({
      id: nextId,
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      description,
      image,
      specs,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const idParam = req.params.id;
    let product;

    if (!isNaN(idParam)) {
      product = await Product.findOne({ id: Number(idParam) });
    } else if (idParam.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idParam);
    }

    if (product) {
      product.name = req.body.name || product.name;
      product.category = req.body.category || product.category;
      product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
      product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
      product.description = req.body.description || product.description;
      product.image = req.body.image || product.image;
      product.specs = req.body.specs || product.specs;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const idParam = req.params.id;
    let result;

    if (!isNaN(idParam)) {
      result = await Product.deleteOne({ id: Number(idParam) });
    } else if (idParam.match(/^[0-9a-fA-F]{24}$/)) {
      result = await Product.deleteOne({ _id: idParam });
    }

    if (result && result.deletedCount > 0) {
      res.json({ message: "Product removed successfully." });
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Seed products into DB
// @route   POST /api/products/seed
// @access  Public
const seedProducts = async (req, res, next) => {
  try {
    // Delete existing products if requested
    if (req.query.clear === "true") {
      await Product.deleteMany({});
    }

    const count = await Product.countDocuments();
    if (count > 0 && req.query.force !== "true") {
      return res.json({ message: "Database already has products. Use ?force=true to seed anyway." });
    }

    // Seed products
    if (req.query.force === "true" || req.query.clear === "true") {
      await Product.deleteMany({});
    }
    
    await Product.insertMany(SEED_PRODUCTS);
    res.json({ message: "Successfully seeded products!", products: SEED_PRODUCTS });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
};
