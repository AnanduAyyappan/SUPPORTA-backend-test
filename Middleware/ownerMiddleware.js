const Product = require("../Models/productModel");

const ownerMiddleware = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { userId, role } = req.user;
    if (!userId || !role) {
      return res.status(400).json({ message: "userId and role are required." });
    }

    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.createdBy !== userId && role !== "admin") {
      return res.status(403).json({ message: "Access denied. Not authorized." });
    }

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = ownerMiddleware;
