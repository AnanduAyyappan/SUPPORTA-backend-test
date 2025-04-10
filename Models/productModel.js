const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    lowercase: true,
  },
  image: {
    type: String, 
    required: true,
  },
  createdBy: {
    type: String, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
