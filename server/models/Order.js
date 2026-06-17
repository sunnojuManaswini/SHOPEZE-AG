const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending",
    },
    items: [
      {
        product: {
          id: { type: Number, required: true },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          image: { type: String, default: "" },
          category: { type: String, default: "" },
        },
        quantity: { type: Number, required: true },
      },
    ],
    totals: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    shippingInfo: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
