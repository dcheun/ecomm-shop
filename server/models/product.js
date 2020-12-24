const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    subcategory: [
      {
        type: ObjectId,
        ref: "Subcategory",
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ["Yes", "No"],
    },
    color: {
      type: String,
      enum: ["Black", "Brown", "Silver", "White", "Blue"],
    },
    brand: {
      type: String,
      enum: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    },
    // ratings: [
    //   {
    //     star: Number,
    //     postedBy: {type: ObjectId, ref: "User"}
    //   }
    // ]
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
