const { toTitleCase } = require("../config/function");
const categoryModel = require("../models/categories");
const fs = require("fs");

class Category {
  async getAllCategory(req, res) {
    try {
      const Categories = await categoryModel.find({}).sort({ _id: -1 });
      if (Categories) {
        return res.json({ Categories });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server error" });
    }
  }

  async postAddCategory(req, res) {
    let { cName, cDescription, cStatus } = req.body;
    const cImage = req.file?.filename;
    const filePath = `../server/public/uploads/categories/${cImage}`;

    // Validate required fields
    if (!cName || !cDescription || !cStatus || !cImage) {
      if (cImage) {
        fs.unlink(filePath, (err) => {
          if (err) console.log(err);
        });
      }
      return res.json({ error: "All fields must be required" });
    }

    cName = toTitleCase(cName);

    try {
      // Check if category already exists
      const checkCategoryExists = await categoryModel.findOne({ cName });
      if (checkCategoryExists) {
        fs.unlink(filePath, (err) => {
          if (err) console.log(err);
        });
        return res.json({ error: "Category already exists" });
      }

      // Create and save new category
      const newCategory = new categoryModel({
        cName,
        cDescription,
        cStatus,
        cImage,
      });

      await newCategory.save(); // ✅ No callback, async/await style
      return res.json({ success: "Category created successfully" });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  async postEditCategory(req, res) {
    const { cId, cDescription, cStatus } = req.body;
    if (!cId || !cDescription || !cStatus) {
      return res.json({ error: "All fields must be required" });
    }

    try {
      const edit = await categoryModel.findByIdAndUpdate(
        cId,
        {
          cDescription,
          cStatus,
          updatedAt: Date.now(),
        },
        { new: true }
      );

      if (edit) {
        return res.json({ success: "Category edited successfully" });
      } else {
        return res.json({ error: "Category not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server error" });
    }
  }

  async getDeleteCategory(req, res) {
    const { cId } = req.body;
    if (!cId) {
      return res.json({ error: "All fields must be required" });
    }

    try {
      const deletedCategoryFile = await categoryModel.findById(cId);
      if (!deletedCategoryFile) {
        return res.json({ error: "Category not found" });
      }

      const filePath = `../server/public/uploads/categories/${deletedCategoryFile.cImage}`;
      const deleteCategory = await categoryModel.findByIdAndDelete(cId);

      if (deleteCategory) {
        // Delete image from uploads -> categories folder
        fs.unlink(filePath, (err) => {
          if (err) console.log(err);
        });
        return res.json({ success: "Category deleted successfully" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server error" });
    }
  }
}

const categoryController = new Category();
module.exports = categoryController;
