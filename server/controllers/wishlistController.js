const Wishlist = require("../models/Wishlist");

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user._id, products: [] });
    }
    res.json(wishlist.products);
  } catch (error) {
    next(error);
  }
};

// @desc    Sync / Save user's wishlist
// @route   POST /api/wishlist
// @access  Private
const saveWishlist = async (req, res, next) => {
  try {
    const { products } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user._id, products });
    } else {
      wishlist.products = products;
    }
    await wishlist.save();
    res.json(wishlist.products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  saveWishlist,
};
