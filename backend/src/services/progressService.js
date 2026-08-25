const db = require('../config/db');
const SkillGapService = require('./skillGapService');

class ProgressService {
  /**
   * Update Progress for a Step or Resource
   */
  static async updateStepProgress(userId, stepId, status, progressPercentage = 100, score = null) {
    // 1. Fetch step details
    const steps = await db.query(`SELECT * FROM learning_path_steps WHERE id = ?`, [stepId]);
    if (steps.length === 0) throw new Error('Learning path step not found');
    const step = steps[0];

    // 2. Update step in database
    await db.query(`
      UPDATE learning_path_steps 
      SET status = ?, completion_percentage = ?
      WHERE id = ?
    `, [status, progressPercentage, stepId]);

    // 3. Record in learning_history table
    await db.query(`
      INSERT INTO learning_history (user_id, resource_type, resource_id, status, progress_percentage, score, started_at, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), ${status === 'completed' ? 'NOW()' : 'NULL'})
    `, [userId, step.resource_type, step.resource_id, status, progressPercentage, score]);

    // 4. If completed or assessment passed, update proficiency score in user_skills!
    if (status === 'completed') {
      const newScore = score ? Math.min(100, score) : 85;
      await db.query(`
        INSERT INTO user_skills (user_id, skill_id, proficiency_score, source)
        VALUES (?, ?, ?, 'course_completion')
        ON DUPLICATE KEY UPDATE proficiency_score = GREATEST(proficiency_score, ?)
      `, [userId, step.skill_id, newScore, newScore]);

      // Unlock next locked step in path
      const nextStepOrder = step.step_order + 1;
      await db.query(`
        UPDATE learning_path_steps 
        SET status = 'available'
        WHERE learning_path_id = ? AND step_order = ? AND status = 'locked'
      `, [step.learning_path_id, nextStepOrder]);
    }

    // 5. Recalculate overall path progress
    const allSteps = await db.query(`SELECT status FROM learning_path_steps WHERE learning_path_id = ?`, [step.learning_path_id]);
    const completedCount = allSteps.filter(s => s.status === 'completed').length;
    const overallProgress = Math.round((completedCount / (allSteps.length || 1)) * 100);

    await db.query(`UPDATE learning_paths SET overall_progress = ? WHERE id = ?`, [overallProgress, step.learning_path_id]);

    return {
      stepId,
      status,
      overallProgress,
      unlockedNext: status === 'completed',
    };
  }

  /**
   * Submit Feedback for Recommendation or Resource
   */
  static async submitFeedback(userId, recommendationId, feedbackType, feedbackText = '', rating = 5) {
    const res = await db.query(`
      INSERT INTO user_feedback (user_id, recommendation_id, feedback_type, feedback_text, rating)
      VALUES (?, ?, ?, ?, ?)
    `, [userId, recommendationId, feedbackType, feedbackText, rating]);

    // If marked too_hard or skipped, update recommendation status
    if (recommendationId) {
      await db.query(`UPDATE recommendations SET status = 'rejected' WHERE id = ?`, [recommendationId]);
    }

    return { feedbackId: res.insertId, feedbackType };
  }

  /**
   * Get user learning metrics & progress dashboard data
   */
  static async getUserProgressMetrics(userId) {
    const userSkills = await db.query(`
      SELECT us.*, s.name as skill_name, s.category
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = ?
    `, [userId]);

    const history = await db.query(`
      SELECT * FROM learning_history WHERE user_id = ? ORDER BY id DESC LIMIT 10
    `, [userId]);

    const completedCoursesCount = history.filter(h => h.resource_type === 'course' && h.status === 'completed').length;
    const completedProjectsCount = history.filter(h => h.resource_type === 'project' && h.status === 'completed').length;
    const completedAssessmentsCount = history.filter(h => h.resource_type === 'assessment' && h.status === 'completed').length;

    const activePath = await db.query(`SELECT overall_progress FROM learning_paths WHERE user_id = ? AND status = 'active' LIMIT 1`, [userId]);
    const overallProgress = activePath[0] ? activePath[0].overall_progress : 25;

    return {
      overallProgress,
      learningStreakDays: 5,
      completedCoursesCount,
      completedProjectsCount,
      completedAssessmentsCount,
      skills: userSkills,
      recentActivity: history,
    };
  }
}

module.exports = ProgressService;
