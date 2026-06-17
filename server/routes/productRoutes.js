const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const { validateProduct } = require("../middleware/validationMiddleware");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, admin, validateProduct, addProduct);
router.put("/:id", protect, admin, validateProduct, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.post("/seed", seedProducts);

module.exports = router;
