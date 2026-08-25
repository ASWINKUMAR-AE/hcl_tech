const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { error } = require('../utils/responseHandler');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Authentication token missing or invalid', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return error(res, 'Token is invalid or expired. Please login again.', 401, 'INVALID_TOKEN');
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return error(res, `Forbidden. Requires '${role}' privilege.`, 403, 'FORBIDDEN');
    }
    next();
  };
}

module.exports = {
  verifyToken,
  requireRole,
};
