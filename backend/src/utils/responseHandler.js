/**
 * Utility response helpers for consistent API output
 */

function success(res, data = {}, message = 'Operation successful', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function error(res, message = 'Internal server error', statusCode = 500, errorCode = 'SERVER_ERROR') {
  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
  });
}

module.exports = {
  success,
  error,
};
