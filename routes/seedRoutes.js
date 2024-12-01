import express from "express";
import Product from "../models/productModel.js";
import data from "../data.js";
import User from "../models/userModel.js";

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  try {
    // Dropping indexes before deleting documents
    await User.collection.dropIndexes();
    await Product.collection.dropIndexes();

    // Deleting all documents from the collections
    await User.deleteMany({});
    await Product.deleteMany({});

    // Inserting sample data
    const createdUsers = await User.insertMany(data.users);
    const createdProducts = await Product.insertMany(data.products);

    res.send({ createdUsers, createdProducts });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default seedRouter;
