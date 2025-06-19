const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role; // Attach role for RBAC
    next();
  } catch (error) {
    console.error('verifyToken: Error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const restrictTo = (role) => (req, res, next) => {
  if (req.userRole !== role) {
    return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
  }
  next();
};

module.exports = { verifyToken, restrictTo };