const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, progressController.getProgress);
router.get('/skills', verifyToken, progressController.getProgressSkills);
router.get('/milestones', verifyToken, progressController.getProgressMilestones);

module.exports = router;
