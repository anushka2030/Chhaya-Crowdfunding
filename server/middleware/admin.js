const jwt = require('jsonwebtoken');
const User = require('../models/user');

const adminMiddleware = async (req, res, next) => {

   let token;
   const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.header('x-auth-token')) {
    token = req.header('x-auth-token');
  }
  if (!token) return res.status(401).json({ msg: 'No token, auth denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded); // Debug line
    const user = await User.findById(decoded.id);
    console.log('User from DB:', user?.email, user?.role); // Debug line
    if (!user || user.role !== 'admin') {
      console.log('Access denied - User role:', user?.role); // Debug line
      return res.status(403).json({ msg: 'Admin access only' });
    }

    req.user = user; // Pass full user object
    next();
  } catch (err) {
     console.log('JWT Error:', err.message); // Debug line
    res.status(401).json({ msg: 'Token invalid or expired' });
  }
};

module.exports = adminMiddleware;