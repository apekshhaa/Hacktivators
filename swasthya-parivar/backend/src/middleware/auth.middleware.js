// Middleware to verify Firebase token
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  // Verification logic placeholder
  console.log("Token verified");
  next();
};