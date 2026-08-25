const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken } = require('../middleware/auth');

router.get('/', courseController.getAllCourses);
router.get('/recommended', verifyToken, courseController.getRecommendedCourses);
router.get('/:id', courseController.getCourseById);

module.exports = router;
