const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const slugify = require("slugify");

const create = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  if (newProduct) {
    res.json(newProduct);
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

const list = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
});

module.exports = {
  create,
  list,
};
