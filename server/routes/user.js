const express = require("express");

const { authCheck, adminCheck } = require("../middleware/auth");
const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
} = require("../controllers/user");

const router = express.Router();

router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart);
router.post("/user/address", authCheck, saveAddress);
// order
router.post("/user/order", authCheck, createOrder);
// coupon
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart);

module.exports = router;
