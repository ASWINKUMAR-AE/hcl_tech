const db = require('../config/db');
const SkillGraphService = require('./skillGraphService');
const VectorSearchService = require('./vectorSearchService');
const AIService = require('./aiService');

class RecommendationService {
  /**
   * Generate & score resource recommendations for a user
   */
  static async generateRecommendations(userId, limit = 10) {
    // 1. Get learner profile & skills
    const profiles = await db.query(`SELECT * FROM learner_profiles WHERE user_id = ?`, [userId]);
    const profile = profiles[0] || { career_goal: 'Full Stack Web Developer', experience_level: 'intermediate', interests: '' };

    const userSkills = await db.query(`SELECT * FROM user_skills WHERE user_id = ?`, [userId]);
    const userSkillMap = new Map(userSkills.map(s => [s.skill_id, s.proficiency_score]));

    // 2. Fetch history & feedback signals
    const history = await db.query(`SELECT * FROM learning_history WHERE user_id = ?`, [userId]);
    const completedResourceIds = new Set(history.filter(h => h.status === 'completed').map(h => `${h.resource_type}_${h.resource_id}`));

    const feedbackList = await db.query(`SELECT * FROM user_feedback WHERE user_id = ?`, [userId]);
    const rejectedRecommendationIds = new Set(feedbackList.filter(f => f.feedback_type === 'not_useful' || f.feedback_type === 'skipped').map(f => f.recommendation_id));

    // 3. Retrieve courses, projects, assessments
    const courses = await db.query(`
      SELECT c.*, GROUP_CONCAT(cs.skill_id) as skill_ids 
      FROM courses c 
      LEFT JOIN course_skills cs ON c.id = cs.course_id 
      GROUP BY c.id
    `);

    // 4. Calculate score for each course
    const scoredCourses = [];

    for (const course of courses) {
      if (completedResourceIds.has(`course_${course.id}`)) continue;

      const courseSkillIds = course.skill_ids ? course.skill_ids.split(',').map(Number) : [];

      // A. Goal Relevance (30 pts)
      const semanticMatches = await VectorSearchService.searchCourses(profile.career_goal, [], 20);
      const semItem = semanticMatches.find(m => m.id === course.id);
      const goalScore = semItem ? (semItem.semanticScore / 100) * 30 : 15;

      // B. Skill Gap Relevance (25 pts)
      let gapScore = 0;
      let prereqScore = 20;

      for (const sId of courseSkillIds) {
        const userProficiency = userSkillMap.get(sId) || 0;
        if (userProficiency < 75) {
          gapScore += 25 / (courseSkillIds.length || 1);
        }

        // C. Prerequisite check (20 pts)
        const prereqCheck = await SkillGraphService.checkPrerequisitesSatisfied(userId, sId);
        if (!prereqCheck.satisfied) {
          prereqScore -= 10;
        }
      }
      prereqScore = Math.max(0, prereqScore);

      // D. Difficulty & Experience Level Match (15 pts)
      let difficultyScore = 15;
      if (profile.experience_level === 'beginner' && course.difficulty_level === 'advanced') difficultyScore = 5;
      if (profile.experience_level === 'advanced' && course.difficulty_level === 'beginner') difficultyScore = 5;

      // E. Interest Match (10 pts)
      let interestScore = 5;
      if (profile.interests && course.description && profile.interests.toLowerCase().split(',').some(i => course.description.toLowerCase().includes(i.trim()))) {
        interestScore = 10;
      }

      const totalScore = Math.min(100, Math.round(goalScore + gapScore + prereqScore + difficultyScore + interestScore));
      
      scoredCourses.push({
        userId,
        resource_type: 'course',
        resource_id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        provider: course.provider,
        duration_hours: course.duration_hours,
        difficulty_level: course.difficulty_level,
        recommendation_score: totalScore,
        priority: totalScore >= 85 ? 'high' : totalScore >= 70 ? 'medium' : 'low',
        reason: `Goal match for ${profile.career_goal}. Target skills match your current learning path gaps.`,
      });
    }

    // Sort by recommendation score descending
    scoredCourses.sort((a, b) => b.recommendation_score - a.recommendation_score);
    const topRecommendations = scoredCourses.slice(0, limit);

    // Save recommendations to database
    for (const rec of topRecommendations) {
      await db.query(`
        INSERT INTO recommendations (user_id, resource_type, resource_id, recommendation_score, reason, priority, status)
        VALUES (?, ?, ?, ?, ?, ?, 'pending')
        ON DUPLICATE KEY UPDATE recommendation_score=VALUES(recommendation_score), reason=VALUES(reason)
      `, [rec.userId, rec.resource_type, rec.resource_id, rec.recommendation_score, rec.reason, rec.priority]);
    }

    return topRecommendations;
  }
}

module.exports = RecommendationService;
