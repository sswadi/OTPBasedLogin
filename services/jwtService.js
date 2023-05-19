const jwt = require('jsonwebtoken');
const secretKey = 'xxx'; 

// Generate JWT token
exports.generateToken = (email) => {
  const payload = {
    email,
  };

  const options = {
    expiresIn: '1h', // Token expiration time (e.g., 1 hour)
  };

  return jwt.sign(payload, secretKey, options);
};

// Verify and decode JWT token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
