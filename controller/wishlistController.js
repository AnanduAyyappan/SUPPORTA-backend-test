const Wishlist = require('../Models/wishlistModel');

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const productObjectId = req.productObjectId;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [productObjectId] });
    } else {
      if (wishlist.products.includes(productObjectId)) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
      wishlist.products.push(productObjectId);
    }

    await wishlist.save();
    res.status(200).json({ message: "Product added to wishlist" });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getWishlist = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const wishlist = await Wishlist.findOne({ userId }).populate("products");;
  
      console.log("Fetched wishlist:", wishlist); 
  
      if (wishlist.products.length === 0) {
        return res.status(404).json({ message: "Your wishlist is empty" });
      }
  
      res.status(200).json({ wishlist: wishlist.products });
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  
  
  exports.deleteFromWishlist = async (req, res) => {
    try {
      const userId = req.user.userId;
      const productObjectId = req.productObjectId; 
  
      const updatedWishlist = await Wishlist.findOneAndUpdate(
        { userId },
        { $pull: { products: productObjectId } },
        { new: true }
      );
  
      if (!updatedWishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
      }
  
      res.status(200).json({ message: "Product removed from wishlist" });
    } catch (error) {
      console.error("Delete from wishlist error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
