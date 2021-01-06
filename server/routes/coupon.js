const express = require("express");
const { authCheck, adminCheck } = require("../middleware/auth");
const { create, remove, list } = require("../controllers/coupon");

const router = express.Router();

router.post("/coupon", authCheck, adminCheck, create);
router.get("/coupons", authCheck, adminCheck, list);
router.delete("/coupon/:id", authCheck, adminCheck, remove);

module.exports = router;
