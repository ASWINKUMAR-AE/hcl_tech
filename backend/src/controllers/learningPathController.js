const LearningPathService = require('../services/learningPathService');
const ProgressService = require('../services/progressService');
const { success, error } = require('../utils/responseHandler');

async function generatePath(req, res, next) {
  try {
    const userId = req.user.id;
    const { goal } = req.body;
    const path = await LearningPathService.generateLearningPath(userId, goal);
    return success(res, path, 'Personalized learning path generated successfully.');
  } catch (err) {
    next(err);
  }
}

async function getUserPath(req, res, next) {
  try {
    const userId = req.user.id;
    const path = await LearningPathService.getActiveUserPath(userId);
    return success(res, path);
  } catch (err) {
    next(err);
  }
}

async function getPathById(req, res, next) {
  try {
    const { id } = req.params;
    const path = await LearningPathService.getLearningPathById(id);
    if (!path) return error(res, 'Learning path not found', 404);
    return success(res, path);
  } catch (err) {
    next(err);
  }
}

async function updateStepProgress(req, res, next) {
  try {
    const userId = req.user.id;
    const { id: stepId } = req.params;
    const { status = 'completed', completion_percentage = 100, score } = req.body;

    const result = await ProgressService.updateStepProgress(userId, stepId, status, completion_percentage, score);
    return success(res, result, 'Step progress updated.');
  } catch (err) {
    next(err);
  }
}

async function regeneratePath(req, res, next) {
  try {
    const userId = req.user.id;
    const path = await LearningPathService.generateLearningPath(userId);
    return success(res, path, 'Learning path regenerated and adapted to latest progress.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  generatePath,
  getUserPath,
  getPathById,
  updateStepProgress,
  regeneratePath,
};
