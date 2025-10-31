const fs = require("fs");
const categoryModel = require("../models/categories");
const productModel = require("../models/products");
const orderModel = require("../models/orders");
const userModel = require("../models/users");
const customizeModel = require("../models/customize");

class Customize {
  async getImages(req, res) {
    try {
      const Images = await customizeModel.find({});
      if (Images) {
        return res.json({ Images });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async uploadSlideImage(req, res) {
    const image = req.file?.filename;
    if (!image) {
      return res.json({ error: "All fields required" });
    }
    try {
      const newCustomize = new customizeModel({
        slideImage: image,
      });
      const save = await newCustomize.save();
      if (save) {
        return res.json({ success: "Image uploaded successfully" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteSlideImage(req, res) {
    const { id } = req.body;
    if (!id) {
      return res.json({ error: "All fields required" });
    }
    try {
      const deletedSlideImage = await customizeModel.findById(id);
      if (!deletedSlideImage) {
        return res.json({ error: "Image not found" });
      }

      const filePath = `../server/public/uploads/customize/${deletedSlideImage.slideImage}`;

      const deleteImage = await customizeModel.findByIdAndDelete(id);
      if (deleteImage) {
        // Delete Image from uploads/customize folder
        fs.unlink(filePath, (err) => {
          if (err) console.log(err);
        });
        return res.json({ success: "Image deleted successfully" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getAllData(req, res) {
    try {
      const Categories = await categoryModel.countDocuments({});
      const Products = await productModel.countDocuments({});
      const Orders = await orderModel.countDocuments({});
      const Users = await userModel.countDocuments({});

      return res.json({ Categories, Products, Orders, Users });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server error" });
    }
  }
}

const customizeController = new Customize();
module.exports = customizeController;
