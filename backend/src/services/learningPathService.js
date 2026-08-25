const db = require('../config/db');
const SkillGapService = require('./skillGapService');
const RecommendationService = require('./recommendationService');
const AIService = require('./aiService');

class LearningPathService {
  /**
   * Dynamically generate or regenerate personalized learning path for user
   */
  static async generateLearningPath(userId, goalOverride = null) {
    // 1. Get learner profile
    const profiles = await db.query(`SELECT * FROM learner_profiles WHERE user_id = ?`, [userId]);
    const profile = profiles[0] || {};
    const goal = goalOverride || profile.career_goal || 'Full Stack Web Developer';

    // 2. Perform skill-gap analysis
    const skillGap = await SkillGapService.analyzeSkillGap(userId);

    // 3. Get top recommendations
    const recommendations = await RecommendationService.generateRecommendations(userId, 15);

    // 4. Deactivate old active paths
    await db.query(`UPDATE learning_paths SET status = 'archived' WHERE user_id = ? AND status = 'active'`, [userId]);

    // 5. Insert new learning_path record
    const pathResult = await db.query(`
      INSERT INTO learning_paths (user_id, title, goal, description, status, overall_progress)
      VALUES (?, ?, ?, ?, 'active', 0)
    `, [
      userId,
      `Personalized ${goal} Roadmap`,
      goal,
      `AI-generated learning path tailored for your profile with ${skillGap.missing.length} missing skill focus areas.`
    ]);

    const learningPathId = pathResult.insertId;

    // 6. Build ordered steps from courses, projects, assessments
    const courses = await db.query(`SELECT * FROM courses ORDER BY id ASC`);
    const projects = await db.query(`SELECT * FROM projects ORDER BY id ASC`);
    const assessments = await db.query(`SELECT * FROM assessments ORDER BY id ASC`);

    const userSkills = await db.query(`SELECT skill_id, proficiency_score FROM user_skills WHERE user_id = ?`, [userId]);
    const userProficiencyMap = new Map(userSkills.map(us => [us.skill_id, us.proficiency_score]));

    // Define standard milestones sequence
    const milestoneMap = [
      { title: 'HTML5 & CSS3 Essentials', skill_id: 1, milestone: 'Phase 1: Web Foundations', duration: 6.0, type: 'course', id: 1 },
      { title: 'Modern JavaScript Fundamentals', skill_id: 3, milestone: 'Phase 1: Web Foundations', duration: 12.0, type: 'course', id: 2 },
      { title: 'Git & GitHub Workflow Mastery', skill_id: 4, milestone: 'Phase 2: Version Control', duration: 4.0, type: 'course', id: 3 },
      { title: 'React 18 Architecture & Hooks', skill_id: 5, milestone: 'Phase 3: Frontend Framework', duration: 15.0, type: 'course', id: 4 },
      { title: 'Node.js Core & Event Loop', skill_id: 6, milestone: 'Phase 4: Backend Runtime', duration: 10.0, type: 'course', id: 6 },
      { title: 'Express.js Enterprise Framework', skill_id: 7, milestone: 'Phase 5: Server Architecture', duration: 9.0, type: 'course', id: 7 },
      { title: 'MySQL Relational Database Engineering', skill_id: 8, milestone: 'Phase 6: Database Persistence', duration: 11.0, type: 'course', id: 8 },
      { title: 'RESTful API Design & Best Practices', skill_id: 9, milestone: 'Phase 7: API Engineering', duration: 7.0, type: 'course', id: 9 },
      { title: 'Full Stack PathFinder AI Platform', skill_id: 5, milestone: 'Phase 8: Capstone Project', duration: 35.0, type: 'project', id: 6 },
      { title: 'Full Stack Development Readiness Evaluation', skill_id: 9, milestone: 'Phase 9: Final Certification', duration: 0.75, type: 'assessment', id: 9 },
    ];

    let order = 1;
    let completedStepsCount = 0;

    for (const step of milestoneMap) {
      const userScore = userProficiencyMap.get(step.skill_id) || 0;
      let status = 'locked';
      let completionPercentage = 0;

      if (userScore >= 75) {
        status = 'completed';
        completionPercentage = 100;
        completedStepsCount++;
      } else if (order === 1 || userProficiencyMap.get(milestoneMap[order - 2]?.skill_id || 1) >= 75) {
        status = 'available';
      }

      await db.query(`
        INSERT INTO learning_path_steps
        (learning_path_id, step_order, title, resource_type, resource_id, skill_id, milestone, estimated_hours, status, completion_percentage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [learningPathId, order, step.title, step.type, step.id, step.skill_id, step.milestone, step.duration, status, completionPercentage]);

      order++;
    }

    const overallProgress = Math.round((completedStepsCount / milestoneMap.length) * 100);
    await db.query(`UPDATE learning_paths SET overall_progress = ? WHERE id = ?`, [overallProgress, learningPathId]);

    // Attach AI Path Explanation
    const aiExplanation = await AIService.explainPath(goal, milestoneMap);

    return this.getLearningPathById(learningPathId, aiExplanation);
  }

  /**
   * Retrieve Learning Path with Steps
   */
  static async getLearningPathById(pathId, aiExplanation = null) {
    const paths = await db.query(`SELECT * FROM learning_paths WHERE id = ?`, [pathId]);
    if (paths.length === 0) return null;

    const path = paths[0];
    const steps = await db.query(`
      SELECT lps.*, s.name as skill_name, s.category as skill_category
      FROM learning_path_steps lps
      JOIN skills s ON lps.skill_id = s.id
      WHERE lps.learning_path_id = ?
      ORDER BY lps.step_order ASC
    `, [pathId]);

    return {
      ...path,
      steps,
      aiExplanation: aiExplanation || `This learning path consists of ${steps.length} sequential milestones designed to help you achieve: ${path.goal}.`,
    };
  }

  /**
   * Get current active learning path for user
   */
  static async getActiveUserPath(userId) {
    const paths = await db.query(`SELECT * FROM learning_paths WHERE user_id = ? AND status = 'active' ORDER BY id DESC LIMIT 1`, [userId]);
    if (paths.length === 0) {
      return await this.generateLearningPath(userId);
    }
    return await this.getLearningPathById(paths[0].id);
  }
}

module.exports = LearningPathService;
