const router = require("express").Router();

const { check } = require("express-validator");
const { create } = require("../../controllers/salesController");

router.post(
  "/create",
  [
    check("customerName", "Customer name is required").not().isEmpty(),
    check("products", "Products is required")
      .isArray()
      .withMessage("Products must be an array"),
    check("products.*.product", "Product name is required").notEmpty(),
    check("products.*.variant", "Product variant is required").notEmpty(),
    check("products.*.quantity", "Product quantity is required").notEmpty(),
    check("products.*.price", "Product price is required").notEmpty(),
    check("discount", "Discount is required").isNumeric(),
    check("user", "User is required").not().isEmpty(),
  ],
  create
);

module.exports = router;
