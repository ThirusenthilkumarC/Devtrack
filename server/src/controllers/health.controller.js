/**
 * Health Controller
 * Handles health check endpoints for DevTrack API.
 */

const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DevTrack API is running',
    version: '1.0.0'
  });
};

module.exports = {
  getHealth
};
