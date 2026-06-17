const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    rating: {
      type: Number,
      default: 5.0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be greater than 5"],
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    specs: {
      Brand: { type: String, default: "Generic" },
      Weight: { type: String, default: "N/A" },
      Color: { type: String, default: "N/A" },
      Warranty: { type: String, default: "N/A" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
