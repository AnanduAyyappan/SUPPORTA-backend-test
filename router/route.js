const express = require("express");
const registerController = require("../controller/registerController");
const { loginController } = require("../controller/loginController");
const jwtMiddleware = require("../Middleware/jwtMiddleware");
const multerMiddleware=require("../Middleware/multerMiddleware")
const productController=require("../controller/productController")
const ownerMiddleware=require("../Middleware/ownerMiddleware")
const wishlistMiddleware=require("../Middleware/wishlistMiddleware")
const wishlistController=require("../controller/wishlistController")
const router = new express.Router();


router.post("/register",registerController.registerController);

router.get("/login",loginController);

router.post('/add-product',jwtMiddleware,multerMiddleware.single('image'),productController.addProduct)

router.put("/update-product/:productId",jwtMiddleware,ownerMiddleware, multerMiddleware.single('image'), productController.updateProduct);

router.delete("/delete-product/:productId",jwtMiddleware,ownerMiddleware, productController.deleteProduct);

router.post('/wishlist',jwtMiddleware,wishlistMiddleware, wishlistController.addToWishlist);

router.get('/wishlist',jwtMiddleware,wishlistController.getWishlist);

router.delete('/wishlist/:productId',jwtMiddleware,wishlistMiddleware,wishlistController.deleteFromWishlist);  

router.get('/products/search', jwtMiddleware, productController.searchProducts);

router.get('/products/filter/category', jwtMiddleware, productController.filterByCategory);

router.get('/products/filter/price', jwtMiddleware, productController.filterByPriceRange);

module.exports = router;
