const asyncHandler = require("express-async-handler");

const Coupon = require("../models/coupon");

const create = asyncHandler(async (req, res) => {
  const { name, expiry, discount } = req.body;
  const newCoupon = await Coupon.create({ name, expiry, discount });
  if (!newCoupon) {
    res.status(400);
    throw new Error("Invalid coupon data");
  }
  console.log(newCoupon);
  res.json(newCoupon);
});

const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Coupon.findByIdAndDelete(id);
  if (deleted) {
    res.json(deleted);
  } else {
    res.status(404);
    throw new Error("Coupon not found");
  }
});

const list = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

module.exports = {
  create,
  remove,
  list,
};
