/** Catches errors thrown/forwarded by controllers (via asyncHandler) and formats a consistent response. */
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  if (statusCode === 500) console.error(err);
  res.status(statusCode).json({ error: err.message || 'Internal server error' });
}

/** Catches requests to routes that don't exist. */
export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found' });
}
