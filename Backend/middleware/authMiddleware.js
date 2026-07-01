const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authorized - No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This now contains { id, email }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const protectAdmin = (req, res, next) => {
  const AUTHORIZED_ADMINS = ["roshankrishnaraj10@gmail.com" , "varshiniilango08@gmail.com"]; 
  
  if (req.user && AUTHORIZED_ADMINS.includes(req.user.email)) {
    next(); 
  } else {
    res.status(403).json({ message: "Access Denied: Not an admin" });
  }
};

module.exports = { authenticate, protectAdmin };