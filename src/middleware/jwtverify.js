const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const secret = process.env.JWT_SECRET_KEY

// Middleware function to verify JWT token in Authorization header
function verifyToken(req, res, next) {
  
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }
  
  try {
   
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();

  } catch (ex) {
    // If token is invalid or expired, return a 400 Bad Request error
    res.status(400).send('Invalid token.');
  }
}

module.exports = verifyToken;