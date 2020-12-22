const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const subcategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
      minlength: [2, "Too short"],
      maxlength: [32, "Too long"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    parent: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

subcategorySchema.index({ slug: 1, parent: 1 }, { unique: true });

const Subcategory = mongoose.model("Subcategory", subcategorySchema);

module.exports = Subcategory;
