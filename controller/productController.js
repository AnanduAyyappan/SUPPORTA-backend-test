const Product = require("../Models/productModel");

const generateProductId = async () => {
  const lastProduct = await Product.findOne().sort({ createdAt: -1 });

  if (!lastProduct || !lastProduct.productId) {
    return "PROD001";
  }

  const lastNum = parseInt(lastProduct.productId.replace("PROD", ""));
  const nextNum = lastNum + 1;
  return "PROD" + nextNum.toString().padStart(3, "0");
};

exports.addProduct = async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
      const image = req.file?.path;
  
      if (!name || name.length < 3) {
        return res.status(400).json({ message: "Product name must be at least 3 characters" });
      }
  
      if (!description || description.length < 10 || description.length > 50) {
        return res.status(400).json({ message: "Description must be 10 to 50 characters" });
      }
  
      if (!price || isNaN(price)) {
        return res.status(400).json({ message: "Price must be a number" });
      }
  
      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }
  
      if (!image) {
        return res.status(400).json({ message: "Image is required" });
      }
  
      if (!req.user?.userId) {
        return res.status(401).json({ message: "Unauthorized: No userId found" });
      }
  
      const productId = await generateProductId();
  
      const newProduct = new Product({
        productId,
        name,
        description,
        price,
        category: category.toLowerCase(),
        image,
        createdBy: req.body.createdBy 
      });
  
      await newProduct.save();
  
      res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  



exports.updateProduct = async (req, res) => {
    try {
      const productId = req.params.productId;
      const { name, description, price, category } = req.body;
  
      const product = await Product.findOne({ productId });
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      if (product.userId !== req.user.userId && req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized to update this product" });
      }
  
      const updatedFields = {};
  
      if (name) {
        if (name.length < 3) {
          return res.status(400).json({ message: "Product name must be at least 3 characters" });
        }
        updatedFields.name = name;
      }
  
      if (description) {
        if (description.length < 10 || description.length > 50) {
          return res.status(400).json({ message: "Description must be 10 to 50 characters" });
        }
        updatedFields.description = description;
      }
  
      if (price) {
        if (isNaN(price)) {
          return res.status(400).json({ message: "Price must be a number" });
        }
        updatedFields.price = price;
      }
  
      if (category) {
        updatedFields.category = category.toLowerCase();
      }
  
      if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ message: "No valid fields provided for update" });
      }
  
      const updatedProduct = await Product.findOneAndUpdate(
        { productId },
        { $set: updatedFields },
        { new: true }
      );
  
      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Server error" });
    }
  };


  exports.deleteProduct = async (req, res) => {
    try {
      const { productId } = req.params;
  
      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }
  
      const deletedProduct = await Product.findOneAndDelete({ productId });
  
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  


exports.searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";

    const products = await Product.find({
      name: { $regex: searchQuery, $options: "i" } 
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error("Product search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.filterByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const products = await Product.find({ category });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Category filter error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.filterByPriceRange = async (req, res) => {
  try {
    const { min, max } = req.query;

    const products = await Product.find({
      price: {
        $gte: Number(min),
        $lte: Number(max)
      }
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Price filter error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


  
  