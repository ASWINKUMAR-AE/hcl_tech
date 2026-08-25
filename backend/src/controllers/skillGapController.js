const SkillGapService = require('../services/skillGapService');
const { success, error } = require('../utils/responseHandler');

async function getSkillGap(req, res, next) {
  try {
    const userId = req.user.id;
    const gapData = await SkillGapService.analyzeSkillGap(userId);
    return success(res, gapData);
  } catch (err) {
    next(err);
  }
}

async function analyzeSkillGap(req, res, next) {
  try {
    const userId = req.user.id;
    const gapData = await SkillGapService.analyzeSkillGap(userId);
    return success(res, gapData, 'Skill-gap analysis completed.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSkillGap,
  analyzeSkillGap,
};
