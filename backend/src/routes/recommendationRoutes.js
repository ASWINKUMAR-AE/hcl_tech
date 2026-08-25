const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, recommendationController.getRecommendations);
router.post('/:id/feedback', verifyToken, recommendationController.submitFeedback);
router.post('/:id/start', verifyToken, recommendationController.startResource);
router.post('/:id/complete', verifyToken, recommendationController.completeResource);

module.exports = router;
