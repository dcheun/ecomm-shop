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

const read = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug })
    .populate("category")
    .populate("subcategory");
  res.json(product);
});

const listAll = asyncHandler(async (req, res) => {
  const { count } = req.params;

  const products = await Product.find({})
    .limit(parseInt(count))
    .populate("category")
    .populate("subcategory")
    .sort([["createdAt", "desc"]]);
  res.json(products);
});

const update = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  req.body.slug = slugify(req.body.title);
  const updated = await Product.findOneAndUpdate({ slug }, req.body, {
    new: true,
  });
  if (updated) {
    res.json(updated);
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

const remove = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const deleted = await Product.findOneAndDelete({ slug });
  res.json(deleted);
});

module.exports = {
  create,
  listAll,
  remove,
  read,
  update,
};
