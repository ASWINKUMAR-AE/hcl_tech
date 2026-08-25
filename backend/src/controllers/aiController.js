const AIService = require('../services/aiService');
const ProfilingService = require('../services/profilingService');
const LearningPathService = require('../services/learningPathService');
const SkillGapService = require('../services/skillGapService');
const db = require('../config/db');
const { success, error } = require('../utils/responseHandler');

async function chat(req, res, next) {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) return error(res, 'Message is required', 400);

    // 1. Fetch user context
    const profile = await ProfilingService.getProfile(userId);
    const activePath = await LearningPathService.getActiveUserPath(userId);
    const gapAnalysis = await SkillGapService.analyzeSkillGap(userId);

    const context = {
      user_id: userId,
      name: req.user.name,
      career_goal: profile ? profile.career_goal : 'Full Stack Web Developer',
      experience_level: profile ? profile.experience_level : 'intermediate',
      current_step: activePath && activePath.steps ? activePath.steps.find(s => s.status === 'in_progress' || s.status === 'available')?.title : 'React 18 Architecture',
      mastered_skills: gapAnalysis.mastered.map(s => s.name).join(', '),
      missing_skills: gapAnalysis.missing.map(s => s.name).join(', '),
    };

    // Save user message to database
    const sessionId = `session_${userId}`;
    await db.query(`INSERT INTO ai_conversations (user_id, session_id, role, message) VALUES (?, ?, 'user', ?)`, [userId, sessionId, message]);

    // Call AI Service
    const aiResponse = await AIService.chat(message, context);

    // Save AI response to database
    await db.query(`INSERT INTO ai_conversations (user_id, session_id, role, message) VALUES (?, ?, 'assistant', ?)`, [userId, sessionId, aiResponse]);

    return success(res, { ai_response: aiResponse, context });
  } catch (err) {
    next(err);
  }
}

async function analyzeGoal(req, res, next) {
  try {
    const userId = req.user.id;
    const { goal } = req.body;
    if (!goal) return error(res, 'Goal is required', 400);

    const result = await AIService.analyzeGoal(goal, userId);
    return success(res, result);
  } catch (err) {
    next(err);
  }
}

async function generatePath(req, res, next) {
  try {
    const userId = req.user.id;
    const { goal } = req.body;
    const path = await LearningPathService.generateLearningPath(userId, goal);
    return success(res, path);
  } catch (err) {
    next(err);
  }
}

async function explainRecommendation(req, res, next) {
  try {
    const userId = req.user.id;
    const { resource } = req.body;
    const profile = await ProfilingService.getProfile(userId);
    const explanation = await AIService.explainRecommendation(profile, resource || { title: 'React Development', category: 'Frontend', difficulty_level: 'intermediate' });
    return success(res, { explanation });
  } catch (err) {
    next(err);
  }
}

async function skillGap(req, res, next) {
  try {
    const userId = req.user.id;
    const gap = await SkillGapService.analyzeSkillGap(userId);
    return success(res, gap);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  chat,
  analyzeGoal,
  generatePath,
  explainRecommendation,
  skillGap,
};
