const express = require('express');
const router = express.Router();
const skillGapController = require('../controllers/skillGapController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, skillGapController.getSkillGap);
router.post('/analyze', verifyToken, skillGapController.analyzeSkillGap);

module.exports = router;
