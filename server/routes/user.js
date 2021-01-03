const express = require("express");

const { authCheck, adminCheck } = require("../middleware/auth");
const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
} = require("../controllers/user");

const router = express.Router();

// router.get("/user", (req, res) => {
//   res.json({
//     data: "user endpoint",
//   });
// });

router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart);
router.post("/user/address", authCheck, saveAddress);

module.exports = router;
