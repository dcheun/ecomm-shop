const asyncHandler = require("express-async-handler");

const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  let products = [];

  const user = await User.findOne({ email: req.user.email });
  // Check if cart with logged in user id already exists.
  const cartExistsByThisUser = await Cart.findOne({ orderedBy: user._id });
  if (cartExistsByThisUser) {
    cartExistsByThisUser.remove();
    console.log("removed old cart");
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    // get price for creating total
    let productFromDb = await Product.findById(cart[i]._id).select("price");
    object.price = productFromDb.price;
    products.push(object);
  }

  let cartTotal = 0;
  for (let i = 0; i < cart.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  console.log("cartTotal", cartTotal);

  let newCart = await Cart.create({
    products,
    cartTotal,
    orderedBy: user._id,
  });

  console.log("newCart=", newCart);

  if (newCart) {
    res.json({ ok: true });
  } else {
    res.status(400);
    throw new Error("Invalid cart data");
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  const cart = await Cart.findOne({ orderedBy: user._id }).populate(
    "products.product",
    "_id title price totalAfterDiscount"
  );

  if (!cart) {
    res.status(400);
    throw new Error("No cart found");
  }

  const { products, cartTotal, totalAfterDiscount } = cart;
  res.json({ products, cartTotal, totalAfterDiscount });
});

const emptyCart = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  const cart = await Cart.findOneAndRemove({ orderedBy: user._id });

  res.json(cart);
});

const saveAddress = asyncHandler(async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    {
      address: req.body.address,
    }
  );

  res.json({ ok: true });
});

const applyCouponToUserCart = asyncHandler(async (req, res) => {
  const { coupon } = req.body;

  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    res.status(400);
    throw new Error("Invalid coupon");
  }

  const user = await User.findOne({ email: req.user.email });
  const { products, cartTotal } = await Cart.findOne({
    orderedBy: user._id,
  }).populate("products.product", "_id title price");

  console.log("cartTotal", cartTotal, "discount%", validCoupon.discount);

  // Calculate the total after discount
  const totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);

  await Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount },
    { new: true }
  );

  res.json({ totalAfterDiscount });
});

const createOrder = asyncHandler(async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email });

  const { products } = await Cart.findOne({ orderedBy: user._id });

  const newOrder = await Order.create({
    products,
    paymentIntent,
    orderedBy: user._id,
  });

  // Decrement inStock, increment sold
  const bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  const updated = await Product.bulkWrite(bulkOption, {});
  console.log("updated=", updated);

  console.log("NEW ORDER SAVED", newOrder);
  res.json({ ok: true });
});

module.exports = {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
};
