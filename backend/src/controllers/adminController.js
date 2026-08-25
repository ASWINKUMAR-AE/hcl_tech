const db = require('../config/db');
const { success, error } = require('../utils/responseHandler');

async function getStats(req, res, next) {
  try {
    const usersCount = (await db.query(`SELECT COUNT(*) as c FROM users`))[0].c;
    const coursesCount = (await db.query(`SELECT COUNT(*) as c FROM courses`))[0].c;
    const skillsCount = (await db.query(`SELECT COUNT(*) as c FROM skills`))[0].c;
    const pathsCount = (await db.query(`SELECT COUNT(*) as c FROM learning_paths`))[0].c;
    const recsCount = (await db.query(`SELECT COUNT(*) as c FROM recommendations`))[0].c;

    return success(res, {
      totalUsers: usersCount,
      totalCourses: coursesCount,
      totalSkills: skillsCount,
      totalLearningPathsGenerated: pathsCount,
      totalRecommendationsServed: recsCount,
    });
  } catch (err) {
    next(err);
  }
}

async function addCourse(req, res, next) {
  try {
    const { title, description, provider = 'PathFinder Academy', category, difficulty_level = 'intermediate', duration_hours = 5.0, url = '#' } = req.body;
    if (!title || !category) return error(res, 'Title and category are required', 400);

    const result = await db.query(
      `INSERT INTO courses (title, description, provider, category, difficulty_level, duration_hours, url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, provider, category, difficulty_level, duration_hours, url]
    );

    return success(res, { id: result.insertId, title }, 'Course added successfully.', 201);
  } catch (err) {
    next(err);
  }
}

async function updateCourse(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, category, difficulty_level, duration_hours, url } = req.body;

    await db.query(
      `UPDATE courses SET title=?, description=?, category=?, difficulty_level=?, duration_hours=?, url=? WHERE id=?`,
      [title, description, category, difficulty_level, duration_hours, url, id]
    );

    return success(res, null, 'Course updated successfully.');
  } catch (err) {
    next(err);
  }
}

async function deleteCourse(req, res, next) {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM courses WHERE id = ?`, [id]);
    return success(res, null, 'Course deleted successfully.');
  } catch (err) {
    next(err);
  }
}

async function addSkill(req, res, next) {
  try {
    const { name, description, category, difficulty_level } = req.body;
    if (!name || !category) return error(res, 'Name and category are required', 400);

    const result = await db.query(
      `INSERT INTO skills (name, description, category, difficulty_level) VALUES (?, ?, ?, ?)`,
      [name, description, category, difficulty_level]
    );

    return success(res, { id: result.insertId, name }, 'Skill added successfully.', 201);
  } catch (err) {
    next(err);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await db.query(`SELECT id, name, email, role, avatar, created_at FROM users ORDER BY id DESC`);
    return success(res, users);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStats,
  addCourse,
  updateCourse,
  deleteCourse,
  addSkill,
  getAllUsers,
};
