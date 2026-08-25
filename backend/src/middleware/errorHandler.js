const { error } = require('../utils/responseHandler');
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(err.message || 'Unhandled error', { stack: err.stack, url: req.originalUrl });
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred.';
  const errorCode = err.errorCode || 'INTERNAL_ERROR';

  return error(res, message, statusCode, errorCode);
}

module.exports = errorHandler;
