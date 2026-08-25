const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { verifyToken } = require('../middleware/auth');

router.get('/', skillController.getAllSkills);
router.get('/profile', verifyToken, skillController.getUserSkills);
router.post('/profile', verifyToken, skillController.addUserSkill);
router.put('/profile/:id', verifyToken, skillController.updateUserSkill);
router.get('/:id', skillController.getSkillById);

module.exports = router;
