const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbService = require('../services/db.service');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'devtrack_super_secret_jwt_key_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const existingUser = await dbService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await dbService.createUser({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'ADMIN' // First user or standard registration defaults cleanly
    });

    const token = generateToken(user.id);

    // Log registration activity
    await dbService.logActivity({
      userId: user.id,
      action: 'Registered new account',
      entityType: 'User',
      entityId: user.id
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user.id);

    // Log login activity
    await dbService.logActivity({
      userId: user.id,
      action: 'Logged into DevTrack',
      entityType: 'User',
      entityId: user.id
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe
};
