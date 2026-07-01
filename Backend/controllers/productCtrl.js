const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    // 1. Print exactly what the frontend sent to the backend
    console.log("--- INCOMING PRODUCT DATA ---");
    console.log(req.body); 

    // 2. Attempt to save to MongoDB
    const newProduct = await Product.create(req.body);
    
    // 3. Success!
    res.status(201).json(newProduct);

  } catch (error) {
    // 4. If it fails, print a MASSIVE error block so we can't miss it
    console.log("========== MONGODB ERROR ==========");
    console.error(error); 
    console.log("===================================");
    
    // Send the actual error message back to the frontend instead of just "Server Error"
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the product by ID and update it with the new data
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true } // This ensures the function returns the updated version
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// IMPORTANT: Make sure to include updateProduct in your exports at the bottom!
module.exports = { getProducts, addProduct, updateProduct };