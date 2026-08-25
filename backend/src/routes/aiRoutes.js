const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken } = require('../middleware/auth');

router.post('/chat', verifyToken, aiController.chat);
router.post('/analyze-goal', verifyToken, aiController.analyzeGoal);
router.post('/generate-path', verifyToken, aiController.generatePath);
router.post('/explain-recommendation', verifyToken, aiController.explainRecommendation);
router.post('/skill-gap', verifyToken, aiController.skillGap);

module.exports = router;
