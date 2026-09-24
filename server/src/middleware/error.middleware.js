/**
 * Centralized Error Handling Middleware
 * Catches and formats unhandled server errors.
 */

/* eslint-disable-next-line no-unused-vars */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
