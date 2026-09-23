const express = require('express');
const { getHealth } = require('../controllers/health.controller');

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Get API health status
 * @access  Public
 */
router.get('/', getHealth);

module.exports = router;
