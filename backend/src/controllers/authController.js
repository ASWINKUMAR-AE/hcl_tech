const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config/env');
const { success, error } = require('../utils/responseHandler');

async function register(req, res, next) {
  try {
    const { name, email, password, role = 'learner' } = req.body;
    if (!name || !email || !password) {
      return error(res, 'Name, email, and password are required.', 400, 'VALIDATION_ERROR');
    }

    const existingUsers = await db.query(`SELECT id FROM users WHERE email = ?`, [email]);
    if (existingUsers.length > 0) {
      return error(res, 'An account with this email address already exists.', 400, 'EMAIL_EXISTS');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    const result = await db.query(
      `INSERT INTO users (name, email, password_hash, role, avatar) VALUES (?, ?, ?, ?, ?)`,
      [name, email, password_hash, role, avatar]
    );

    const userId = result.insertId;

    // Create default learner profile
    await db.query(
      `INSERT INTO learner_profiles (user_id, career_goal, experience_level) VALUES (?, 'Full Stack Web Developer', 'intermediate')`,
      [userId]
    );

    const token = jwt.sign({ id: userId, email, role, name }, config.jwtSecret, { expiresIn: '7d' });

    return success(res, {
      token,
      user: { id: userId, name, email, role, avatar },
      is_first_login: true,
    }, 'Account registered successfully.', 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return error(res, 'Email and password are required.', 400, 'VALIDATION_ERROR');
    }

    const users = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
    if (users.length === 0) {
      return error(res, 'Invalid credentials. User not found.', 401, 'INVALID_CREDENTIALS');
    }

    const user = users[0];
    
    // For demo account or standard bcrypt verification
    let isMatch = false;
    if (email === 'demo@pathfinder.ai' && (password === 'Demo@123' || password === 'demo123')) {
      isMatch = true;
    } else {
      isMatch = await bcrypt.compare(password, user.password_hash);
    }

    if (!isMatch) {
      return error(res, 'Invalid credentials. Password incorrect.', 401, 'INVALID_CREDENTIALS');
    }

    const activePaths = await db.query(`SELECT id FROM learning_paths WHERE user_id = ? AND status = 'active'`, [user.id]);
    const isFirstLogin = activePaths.length === 0;

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, config.jwtSecret, { expiresIn: '7d' });

    return success(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      is_first_login: isFirstLogin,
    }, 'Login successful.');
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const userId = req.user.id;
    const users = await db.query(`SELECT id, name, email, role, avatar, created_at FROM users WHERE id = ?`, [userId]);
    if (users.length === 0) {
      return error(res, 'User not found', 404, 'NOT_FOUND');
    }
    const profiles = await db.query(`SELECT * FROM learner_profiles WHERE user_id = ?`, [userId]);

    return success(res, {
      user: users[0],
      profile: profiles[0] || null,
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res) {
  return success(res, null, 'Logged out successfully.');
}

module.exports = {
  register,
  login,
  getMe,
  logout,
};
