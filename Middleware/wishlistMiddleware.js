const Product = require('../Models/productModel');

const wishlistMiddleware = async (req, res, next) => {
  try {
    const { productId } = req.body; 
    const userId = req.user.userId;

    const product = await Product.findOne({ productId }); 
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.createdBy.toString() === userId.toString()) {
      return res.status(403).json({ message: "You cannot add your own product to wishlist" });
    }

    req.productObjectId = product._id;

    next();
  } catch (error) {
    console.error("Wishlist middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = wishlistMiddleware;
