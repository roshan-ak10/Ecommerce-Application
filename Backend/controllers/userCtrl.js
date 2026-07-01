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

// --- REGISTER NEW USER ---
const registerUser = async (req, res) => {
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
};

// --- LOGIN EXISTING USER ---
const loginUser = async (req, res) => {
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
};

// --- LOGOUT USER ---
const logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0) 
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };