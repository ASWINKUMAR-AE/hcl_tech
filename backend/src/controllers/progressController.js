const ProgressService = require('../services/progressService');
const LearningPathService = require('../services/learningPathService');
const { success, error } = require('../utils/responseHandler');

async function getProgress(req, res, next) {
  try {
    const userId = req.user.id;
    const metrics = await ProgressService.getUserProgressMetrics(userId);
    return success(res, metrics);
  } catch (err) {
    next(err);
  }
}

async function getProgressSkills(req, res, next) {
  try {
    const userId = req.user.id;
    const metrics = await ProgressService.getUserProgressMetrics(userId);
    return success(res, metrics.skills);
  } catch (err) {
    next(err);
  }
}

async function getProgressMilestones(req, res, next) {
  try {
    const userId = req.user.id;
    const activePath = await LearningPathService.getActiveUserPath(userId);
    return success(res, activePath ? activePath.steps : []);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProgress,
  getProgressSkills,
  getProgressMilestones,
};
