const asyncHandler = require("express-async-handler");

const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");

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

module.exports = {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
};
