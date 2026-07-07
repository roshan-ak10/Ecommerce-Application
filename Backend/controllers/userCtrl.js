const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- GENERATE TOKEN HELPER ---
const generateToken = (id, email) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined in the environment.");
  }
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRE || '7d' 
  });
};

// --- USER CONTROLLER ---
const userCtrl = {
  
  // 1. REGISTER NEW USER
  registerUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) return res.status(400).json({ message: "Please provide all required fields." });
      if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters long." });

      const normalizedEmail = email.toLowerCase().trim();
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) return res.status(400).json({ message: "A user with this email already exists." });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({ name: name.trim(), email: normalizedEmail, password: hashedPassword });

      const token = generateToken(newUser._id, newUser.email);

      res.cookie('token', token, {
        httpOnly: true, 
        secure: true, 
        sameSite: 'none', 
        maxAge: 7 * 24 * 60 * 60 * 1000 
      });

      res.status(201).json({ _id: newUser._id, name: newUser.name, email: newUser.email });

    } catch (error) {
      console.error("Registration Error:", error); 
      res.status(500).json({ message: "An unexpected server error occurred." }); 
    }
  },

  // 2. LOGIN EXISTING USER
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) return res.status(400).json({ message: "Please provide both email and password." });

      const normalizedEmail = email.toLowerCase().trim();
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) return res.status(401).json({ message: "Invalid email or password." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid email or password." });

      const token = generateToken(user._id, user.email);

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({ _id: user._id, name: user.name, email: user.email });

    } catch (error) {
      console.error("Login Error:", error); 
      res.status(500).json({ message: "An unexpected server error occurred." }); 
    }
  },

  // GET USER PROFILE
  getUserProfile: async (req, res) => {
    try {
      // Find the user by the email passed in the URL
      const user = await User.findOne({ email: req.params.email });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Send back the user's data (including their addresses)
      res.status(200).json(user);
    } catch (error) {
      console.error("Fetch profile error:", error);
      res.status(500).json({ message: "Server error fetching profile" });
    }
  },

  // 3. LOGOUT USER
  logoutUser: (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0) 
    });
    res.status(200).json({ message: "Logged out successfully" });
  },

  // 4. ADD NEW ADDRESS
  addAddress: async (req, res) => {
    try {
      const { email, address } = req.body;

      // Find the user by their unique email
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Push the new address into their addresses array
      user.addresses.push(address);
      
      // Save the updated user to MongoDB
      await user.save();

      // Send back the updated addresses list
      res.status(200).json({ 
        message: "Address saved successfully!", 
        addresses: user.addresses 
      });

    } catch (error) {
      console.error("Add address error:", error);
      res.status(500).json({ message: "Server error saving address" });
    }
  },

  // 5. EDIT ADDRESS
  editAddress: async (req, res) => {
    try {
      const { email, addressId, updatedAddress } = req.body;

      // Find the user AND the specific address, then update it using the $ positional operator
      const user = await User.findOneAndUpdate(
        { email: email, "addresses._id": addressId },
        { $set: { "addresses.$": { ...updatedAddress, _id: addressId } } },
        { new: true } // Returns the updated document
      );

      if (!user) {
        return res.status(404).json({ message: "User or address not found" });
      }

      res.status(200).json({ 
        message: "Address updated successfully!", 
        addresses: user.addresses 
      });
    } catch (error) {
      console.error("Edit address error:", error);
      res.status(500).json({ message: "Server error editing address" });
    }
  },

  // 6. DELETE ADDRESS
  deleteAddress: async (req, res) => {
    try {
      // We grab these from the URL parameters instead of the body for a DELETE request
      const { email, addressId } = req.params;

      // Find the user and $pull (remove) the specific address from the array
      const user = await User.findOneAndUpdate(
        { email: email },
        { $pull: { addresses: { _id: addressId } } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ 
        message: "Address deleted successfully!", 
        addresses: user.addresses 
      });
    } catch (error) {
      console.error("Delete address error:", error);
      res.status(500).json({ message: "Server error deleting address" });
    }
  }

};

// Export the single, clean object
module.exports = userCtrl;