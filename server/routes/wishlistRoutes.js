const express = require("express");
const router = express.Router();
const { getWishlist, saveWishlist } = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getWishlist);
router.post("/", protect, saveWishlist);

module.exports = router;
