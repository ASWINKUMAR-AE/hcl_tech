const db = require('../config/db');
const SkillGraphService = require('./skillGraphService');

class SkillGapService {
  /**
   * Perform comprehensive skill-gap analysis for a user
   */
  static async analyzeSkillGap(userId) {
    // 1. Fetch user profile & career goal
    const profiles = await db.query(`SELECT * FROM learner_profiles WHERE user_id = ?`, [userId]);
    const profile = profiles[0];
    const goal = profile ? profile.career_goal : 'Full Stack Web Developer';

    // 2. Fetch all system skills
    const allSkills = await db.query(`SELECT * FROM skills`);

    // 3. Fetch user's current skill proficiencies
    const userSkillsRaw = await db.query(
      `SELECT us.*, s.name, s.category, s.difficulty_level 
       FROM user_skills us 
       JOIN skills s ON us.skill_id = s.id 
       WHERE us.user_id = ?`,
      [userId]
    );

    const userSkillMap = new Map();
    userSkillsRaw.forEach(us => {
      userSkillMap.set(us.skill_id, us.proficiency_score);
    });

    // 4. Identify goal-relevant skills (e.g. Full Stack requires Frontend + Backend + DB + DevOps)
    const goalLower = goal.toLowerCase();
    const relevantSkills = allSkills.filter(skill => {
      if (goalLower.includes('full stack') || goalLower.includes('web developer')) return true;
      if (goalLower.includes('frontend') && (skill.category === 'Frontend' || skill.category === 'Programming' || skill.category === 'Tools')) return true;
      if (goalLower.includes('backend') && (skill.category === 'Backend' || skill.category === 'Database' || skill.category === 'Programming')) return true;
      return true; // Default include all
    });

    const mastered = [];
    const partiallyLearned = [];
    const missing = [];

    for (const skill of relevantSkills) {
      const score = userSkillMap.get(skill.id) || 0;
      const prereqCheck = await SkillGraphService.checkPrerequisitesSatisfied(userId, skill.id);

      const skillItem = {
        ...skill,
        proficiencyScore: score,
        prerequisitesSatisfied: prereqCheck.satisfied,
        missingPrerequisitesCount: prereqCheck.missingPrerequisites.length,
      };

      if (score >= 75) {
        mastered.push(skillItem);
      } else if (score >= 30) {
        partiallyLearned.push(skillItem);
      } else {
        // Priority calculation: Ready if prerequisites satisfied
        skillItem.priority = prereqCheck.satisfied ? 'high' : 'medium';
        missing.push(skillItem);
      }
    }

    // Sort missing skills so prerequisites come first
    const missingSkillIds = missing.map(s => s.id);
    const sortedIds = await SkillGraphService.sortSkillsByPrerequisites(missingSkillIds);
    missing.sort((a, b) => sortedIds.indexOf(a.id) - sortedIds.indexOf(b.id));

    return {
      userId,
      careerGoal: goal,
      totalSkillsAnalyzed: relevantSkills.length,
      mastered,
      partiallyLearned,
      missing,
      overallReadinessPercentage: Math.round(((mastered.length * 100) + (partiallyLearned.length * 50)) / (relevantSkills.length || 1)),
    };
  }
}

module.exports = SkillGapService;
