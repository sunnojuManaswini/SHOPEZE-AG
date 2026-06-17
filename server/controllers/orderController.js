const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res, next) => {
  try {
    const { items, totals, shippingInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order." });
    }

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Verify stock and decrement
    for (const item of items) {
      const dbProduct = await Product.findOne({ id: item.product.id });
      if (!dbProduct) {
        return res.status(404).json({ message: `Product with ID ${item.product.id} not found.` });
      }
      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${dbProduct.name}. Available: ${dbProduct.stock}, Requested: ${item.quantity}`,
        });
      }
      // Decrement stock
      dbProduct.stock = Math.max(0, dbProduct.stock - item.quantity);
      await dbProduct.save();
    }

    const order = new Order({
      id: orderId,
      email: req.user.email,
      date: dateStr,
      items,
      totals,
      shippingInfo,
      status: "Pending",
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ email: req.user.email }).sort("-createdAt");
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort("-createdAt");
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!["Pending", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status code." });
    }

    const order = await Order.findOne({ id: req.params.id });

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found." });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
