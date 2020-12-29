const asyncHandler = require("express-async-handler");
const Product = require("../models/product");
const slugify = require("slugify");
const User = require("../models/user");

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

// Without pagination
// const list = asyncHandler(async (req, res) => {
//   const { sort, order, limit } = req.body;

//   const products = await Product.find({})
//     .limit(parseInt(limit))
//     .populate("category")
//     .populate("subcategory")
//     .sort([[sort, order]]);
//   res.json(products);
// });

// With pagination
const list = asyncHandler(async (req, res) => {
  const { sort, order, page } = req.body;
  const currentPage = page || 1;
  const perPage = 3;

  const products = await Product.find({})
    .skip((currentPage - 1) * perPage)
    .limit(parseInt(perPage))
    .populate("category")
    .populate("subcategory")
    .sort([[sort, order]]);
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

const productsCount = asyncHandler(async (req, res) => {
  const total = await Product.estimatedDocumentCount();
  res.json(total);
});

const productStar = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { star } = req.body;

  const product = await Product.findById(productId);
  const user = await User.findOne({ email: req.user.email });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Who is updating?
  // Check if currently logged in user have already added rating to this product.
  // NOTE: convert check toString because object types doesn't match.
  const existingRatingObject = product.ratings.find(
    (i) => i.postedBy.toString() === user._id.toString()
  );

  // if user haven't left rating yet, push it
  if (existingRatingObject === undefined) {
    const ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star, postedBy: user._id } },
      },
      { new: true }
    );
    console.log("ratingAdded", ratingAdded);
    res.json(ratingAdded);
  } else {
    // if user have already left rating, update it
    const ratingUpdated = await Product.updateOne(
      { ratings: { $elemMatch: existingRatingObject } },
      { $set: { "ratings.$.star": star } },
      { new: true }
    );
    console.log("ratingUpdated", ratingUpdated);
    res.json(ratingUpdated);
  }
});

const listRelated = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subcategory")
    .populate("postedBy");

  res.json(related);
});

module.exports = {
  create,
  listAll,
  remove,
  read,
  update,
  list,
  productsCount,
  productStar,
  listRelated,
};
