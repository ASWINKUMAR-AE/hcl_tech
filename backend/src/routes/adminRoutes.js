const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.use(verifyToken);
router.use(requireRole('admin'));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.post('/courses', adminController.addCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);
router.post('/skills', adminController.addSkill);

module.exports = router;
