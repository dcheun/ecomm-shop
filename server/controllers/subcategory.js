const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Subcategory = require("../models/subcategory");
const Product = require("../models/product");

const create = asyncHandler(async (req, res) => {
  // NOTE: parent should be an ID
  const { name, parent } = req.body;
  const subcategory = await Subcategory.create({
    name,
    slug: slugify(name),
    parent,
  });
  if (subcategory) {
    res.json(subcategory);
  } else {
    res.status(400);
    throw new Error("Invalid subcategory data");
  }
});

const list = asyncHandler(async (req, res) => {
  const subcategories = await Subcategory.find({}).sort({ createdAt: -1 });
  res.json(subcategories);
});

// const read = asyncHandler(async (req, res) => {
//   const { parent } = req.query;
//   console.log("parent=", parent);
//   const subcategory = await Subcategory.find({
//     slug: req.params.slug,
//     ...(parent && { parent }),
//   });
//   if (subcategory) {
//     res.json(subcategory);
//   } else {
//     res.status(404);
//     throw new Error("Subcategory not found");
//   }
// });

const read = asyncHandler(async (req, res) => {
  const { parent } = req.query;
  const include =
    req.query.include instanceof Array
      ? req.query.include
      : req.query.include
      ? [req.query.include]
      : [];
  console.log("parent=", parent);
  console.log("include=", include);
  const subcategories = await Subcategory.find({
    slug: req.params.slug,
    ...(parent && { parent }),
  });
  if (subcategories.length === 0) {
    res.status(404);
    throw new Error("Subcategory not found");
  }
  const includes = {};
  if (include.includes("products")) {
    const products = await Product.find({
      subcategory: subcategories[0],
    }).populate("category");
    includes.products = products;
  }

  res.json({
    subcategories,
    ...includes,
  });
});

const update = asyncHandler(async (req, res) => {
  // NOTE: Slugify will translate a text "Hewlett Packard" -> "Hewlett-Packard"
  // NOTE: Passing in {new: true} to findOneAndUpdate will return the updated
  // document, otherwise the old one is returned.
  const { name, parent } = req.body;
  // const values = {
  //   name: req.body.name,
  //   ...(req.body.parent && { parent: req.body.parent }),
  // };
  const { slug } = req.params;
  const updated = await Subcategory.findOneAndUpdate(
    { slug },
    // { name, slug: slugify(name), ...(parent && { parent }) },
    { name, slug: slugify(name), parent },
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
  const deleted = await Subcategory.findOneAndDelete({ slug });
  if (deleted) {
    res.json(deleted);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

module.exports = {
  create,
  list,
  read,
  update,
  remove,
};
