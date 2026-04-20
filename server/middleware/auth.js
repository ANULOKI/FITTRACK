const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    try {
      // ✅ verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ get REAL user from DB
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // ✅ THIS IS THE FIX
      req.user = user;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
};