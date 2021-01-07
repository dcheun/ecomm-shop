const asyncHandler = require("express-async-handler");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { couponApplied } = req.body;
  // Apply coupon
  // Calculate price

  // 1. Find user
  const user = await User.findOne({ email: req.user.email });
  // 2. Get user cart total
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderedBy: user._id,
  });
  console.log(
    "CART TOTAL CHARGED",
    cartTotal,
    "AFTER DIS%=",
    totalAfterDiscount
  );

  let finalAmount = 0;

  if (couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 100;
  } else {
    finalAmount = cartTotal * 100;
  }

  console.log("finalAmount=", finalAmount, "cents");

  // NOTE: amount is in cents - muliply by 100 to get amount in dollars.
  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount,
    currency: "usd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  });
});

module.exports = {
  createPaymentIntent,
};
