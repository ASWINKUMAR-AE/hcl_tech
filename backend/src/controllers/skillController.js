const db = require('../config/db');
const SkillGraphService = require('../services/skillGraphService');
const { success, error } = require('../utils/responseHandler');

async function getAllSkills(req, res, next) {
  try {
    const skills = await db.query(`SELECT * FROM skills ORDER BY category, name`);
    return success(res, skills);
  } catch (err) {
    next(err);
  }
}

async function getSkillById(req, res, next) {
  try {
    const { id } = req.params;
    const skills = await db.query(`SELECT * FROM skills WHERE id = ?`, [id]);
    if (skills.length === 0) return error(res, 'Skill not found', 404);
    
    const prereqs = await SkillGraphService.getPrerequisites(id);
    return success(res, { ...skills[0], prerequisites: prereqs });
  } catch (err) {
    next(err);
  }
}

async function getUserSkills(req, res, next) {
  try {
    const userId = req.user.id;
    const userSkills = await db.query(`
      SELECT us.*, s.name, s.category, s.difficulty_level, s.description
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = ?
    `, [userId]);
    return success(res, userSkills);
  } catch (err) {
    next(err);
  }
}

async function addUserSkill(req, res, next) {
  try {
    const userId = req.user.id;
    const { skill_id, proficiency_score = 50, source = 'self_assessment' } = req.body;

    if (!skill_id) return error(res, 'skill_id is required', 400);

    await db.query(`
      INSERT INTO user_skills (user_id, skill_id, proficiency_score, source)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE proficiency_score = ?, source = ?
    `, [userId, skill_id, proficiency_score, source, proficiency_score, source]);

    return success(res, null, 'Skill proficiency updated.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllSkills,
  getSkillById,
  getUserSkills,
  addUserSkill,
  updateUserSkill: addUserSkill,
};
