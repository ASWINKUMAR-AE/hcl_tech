const ProfilingService = require('../services/profilingService');
const { success, error } = require('../utils/responseHandler');

async function getProfile(req, res, next) {
  try {
    const profile = await ProfilingService.getProfile(req.user.id);
    return success(res, profile);
  } catch (err) {
    next(err);
  }
}

async function saveProfile(req, res, next) {
  try {
    const profileData = await ProfilingService.createOrUpdateProfile(req.user.id, req.body);
    return success(res, profileData, 'Learner profile updated successfully.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  saveProfile,
  updateProfile: saveProfile,
};
