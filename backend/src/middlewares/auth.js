const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Missing auth token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // attach user info
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

const authorize = (roles = []) => (req, res, next) => {
  if (typeof roles === 'string') roles = [roles];
  if (!roles.length) return next(); // no role restriction
  if (!req.user) return res.status(403).json({ message: 'Forbidden' });
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  next();
};

module.exports = { authenticate, authorize };
