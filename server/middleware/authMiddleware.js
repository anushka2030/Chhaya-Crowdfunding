const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  // Fallback to x-auth-token header
  else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  }

  console.log('Token found:', token ? 'Yes' : 'No');
  console.log('Authorization Header:', req.headers.authorization);
  console.log('X-Auth-Token Header:', req.headers['x-auth-token']);

  if (!token) {
    return res.status(401).json({ 
      msg: "No token provided. Include token in Authorization header as 'Bearer <token>' or x-auth-token header" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Token decoded successfully, user ID:', decoded.id);
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = protect;