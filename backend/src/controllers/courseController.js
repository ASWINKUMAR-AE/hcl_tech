const db = require('../config/db');
const RecommendationService = require('../services/recommendationService');
const { success, error } = require('../utils/responseHandler');

async function getAllCourses(req, res, next) {
  try {
    const courses = await db.query(`SELECT * FROM courses ORDER BY category, rating DESC`);
    return success(res, courses);
  } catch (err) {
    next(err);
  }
}

async function getCourseById(req, res, next) {
  try {
    const { id } = req.params;
    const courses = await db.query(`SELECT * FROM courses WHERE id = ?`, [id]);
    if (courses.length === 0) return error(res, 'Course not found', 404);

    const skills = await db.query(`
      SELECT s.*, cs.importance
      FROM course_skills cs
      JOIN skills s ON cs.skill_id = s.id
      WHERE cs.course_id = ?
    `, [id]);

    return success(res, { ...courses[0], skills });
  } catch (err) {
    next(err);
  }
}

async function getRecommendedCourses(req, res, next) {
  try {
    const userId = req.user.id;
    const recommendations = await RecommendationService.generateRecommendations(userId, 10);
    return success(res, recommendations);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllCourses,
  getCourseById,
  getRecommendedCourses,
};
