const Cart = require("../models/Cart");

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    res.json(cart.items);
  } catch (error) {
    next(error);
  }
};

// @desc    Sync / Save user's cart
// @route   POST /api/cart
// @access  Private
const saveCart = async (req, res, next) => {
  try {
    const { items } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items });
    } else {
      cart.items = items;
    }
    await cart.save();
    res.json(cart.items);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  saveCart,
};
