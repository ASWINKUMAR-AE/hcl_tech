const RecommendationService = require('../services/recommendationService');
const ProgressService = require('../services/progressService');
const { success, error } = require('../utils/responseHandler');

async function getRecommendations(req, res, next) {
  try {
    const userId = req.user.id;
    const recommendations = await RecommendationService.generateRecommendations(userId, 10);
    return success(res, recommendations);
  } catch (err) {
    next(err);
  }
}

async function submitFeedback(req, res, next) {
  try {
    const userId = req.user.id;
    const { id: recommendationId } = req.params;
    const { feedback_type, feedback_text, rating } = req.body;

    const result = await ProgressService.submitFeedback(userId, recommendationId, feedback_type, feedback_text, rating);
    return success(res, result, 'Feedback saved.');
  } catch (err) {
    next(err);
  }
}

async function startResource(req, res, next) {
  try {
    return success(res, { status: 'started' }, 'Resource started.');
  } catch (err) {
    next(err);
  }
}

async function completeResource(req, res, next) {
  try {
    return success(res, { status: 'completed' }, 'Resource completed.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRecommendations,
  submitFeedback,
  startResource,
  completeResource,
};
