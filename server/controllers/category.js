const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");

const create = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  if (category) {
    res.json(category);
  } else {
    res.status(400);
    throw new Error("Invalid category data");
  }
});

const list = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: -1 });
  res.json(categories);
});

const read = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

const update = asyncHandler(async (req, res) => {
  // NOTE: Slugify will translate a text "Hewlett Packard" -> "Hewlett-Packard"
  // NOTE: Passing in {new: true} to findOneAndUpdate will return the updated
  // document, otherwise the old one is returned.
  const { name } = req.body;
  const { slug } = req.params;
  const updated = await Category.findOneAndUpdate(
    { slug },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (updated) {
    res.json(updated);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

const remove = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const deleted = await Category.findOneAndDelete({ slug });
  if (deleted) {
    res.json(deleted);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

const getSubs = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const subcategories = await Subcategory.find({ parent: _id });
  res.json(subcategories);
});

module.exports = {
  create,
  list,
  read,
  update,
  remove,
  getSubs,
};
