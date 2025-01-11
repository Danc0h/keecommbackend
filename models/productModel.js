import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: {
      type: Number,
      default: function () {
        return Math.floor(Math.random() * (25 - 15 + 1)) + 15; // Random discount between 15 and 25
      },
    },
    countInStock: { type: Number, required: true },
    reviews: [reviewSchema],
    description: { type: String, required: true },
    variants: [
      {
        color: { type: String },
        size: { type: String },
        inches: { type: String },
        countInStock: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//first variable productSchema is used to design the db structure and data types of products and is modeled by new mongoose.Schema method

const Product = mongoose.model("Product", productSchema);
export default Product;

//second varible is Product which is an extract of a single product with data types which is modelled by mongoose.model
