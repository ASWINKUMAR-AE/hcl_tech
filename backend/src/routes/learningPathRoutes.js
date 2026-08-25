const express = require('express');
const router = express.Router();
const learningPathController = require('../controllers/learningPathController');
const { verifyToken } = require('../middleware/auth');

router.post('/generate', verifyToken, learningPathController.generatePath);
router.get('/', verifyToken, learningPathController.getUserPath);
router.get('/:id', verifyToken, learningPathController.getPathById);
router.put('/steps/:id/progress', verifyToken, learningPathController.updateStepProgress);
router.post('/regenerate', verifyToken, learningPathController.regeneratePath);

module.exports = router;
