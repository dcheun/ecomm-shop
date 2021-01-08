const asyncHandler = require("express-async-handler");

const Order = require("../models/order");

const orders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("products.product")
    .sort("-createdAt");

  res.json(orders);
});

const orderStatus = asyncHandler(async (req, res) => {
  const { orderId, orderStatus } = req.body;
  const updated = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  );
  res.json(updated);
});

module.exports = {
  orders,
  orderStatus,
};
