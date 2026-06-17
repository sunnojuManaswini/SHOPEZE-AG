require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Base Route
app.get("/", (req, res) => {
  res.send("SHOPEZE API is running...");
});

const checkDbConnection = require("./middleware/dbCheck");

// Mount routes with db check
app.use("/api/auth", checkDbConnection, require("./routes/authRoutes"));
app.use("/api/products", checkDbConnection, require("./routes/productRoutes"));
app.use("/api/orders", checkDbConnection, require("./routes/orderRoutes"));
app.use("/api/cart", checkDbConnection, require("./routes/cartRoutes"));
app.use("/api/wishlist", checkDbConnection, require("./routes/wishlistRoutes"));


// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});