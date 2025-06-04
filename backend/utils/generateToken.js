const jwt = require('jsonwebtoken');


const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      role: user.role,
      tokenVersion: user.tokenVersion
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRY || '24h' }
  );
};

module.exports = generateToken; 