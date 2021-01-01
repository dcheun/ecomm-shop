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

// Search / Filter

// NOTE: text based search (enabled by text: true in Schema)
const handleQuery = asyncHandler(async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name");

  res.json(products);
});

const handlePrice = asyncHandler(async (req, res, price) => {
  const products = await Product.find({
    price: { $gte: price[0], $lte: price[1] },
  })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name");

  res.json(products);
});

const handleCategory = asyncHandler(async (req, res, category) => {
  const products = await Product.find({ category })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name");

  res.json(products);
});

const handleStars = asyncHandler(async (req, res, stars) => {
  const aggregates = await Product.aggregate([
    {
      $project: {
        document: "$$ROOT", // Includes all fields of the document.
        // title: "$title", // <-- so we don't need to write it all out like so.
        floorAverage: {
          $floor: { $avg: "$ratings.star" }, // Eg: 3.33 -> 3
        },
      },
    },
    {
      $match: { floorAverage: stars },
    },
  ]);
  // console.log("aggregates=", aggregates);
  const products = await Product.find({ _id: aggregates })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name");

  res.json(products);
});

const handleSubcategory = asyncHandler(async (req, res, subcategory) => {
  const products = await Product.find({ subcategory })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name");

  res.json(products);
});

const handleShipping = asyncHandler(async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name");

  res.json(products);
});

const handleColor = asyncHandler(async (req, res, color) => {
  const products = await Product.find({ color })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name");

  res.json(products);
});

const handleBrand = asyncHandler(async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate("category", "_id name")
    .populate("subcategory", "_id name")
    .populate("postedBy", "_id name");

  res.json(products);
});

const searchFilters = asyncHandler(async (req, res) => {
  const {
    query,
    price,
    category,
    stars,
    subcategory,
    shipping,
    color,
    brand,
  } = req.body;
  console.log("query=", query);
  console.log("price=", price);
  console.log("category=", category);
  console.log("stars=", stars);
  console.log("subcategory=", subcategory);
  console.log("shipping=", shipping);
  console.log("color=", color);
  console.log("brand=", brand);

  if (query) {
    await handleQuery(req, res, query);
  }

  // Price is an array range, eg: [10, 100]
  if (price !== undefined) {
    await handlePrice(req, res, price);
  }

  if (category !== undefined) {
    await handleCategory(req, res, category);
  }

  if (stars) {
    await handleStars(req, res, stars);
  }

  if (subcategory) {
    await handleSubcategory(req, res, subcategory);
  }
  if (shipping) {
    await handleShipping(req, res, shipping);
  }
  if (color) {
    await handleColor(req, res, color);
  }
  if (brand) {
    await handleBrand(req, res, brand);
  }
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
  searchFilters,
};
