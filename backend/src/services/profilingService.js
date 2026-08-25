const db = require('../config/db');
const AIService = require('./aiService');
const SkillGapService = require('./skillGapService');

class ProfilingService {
  /**
   * Process Onboarding Data and Generate Profile + Initial User Skills
   */
  static async createOrUpdateProfile(userId, data) {
    const {
      experience_level = 'intermediate',
      career_goal = 'Full Stack Web Developer specializing in React and Node.js',
      interests = 'Web Architecture, React, REST APIs',
      preferred_learning_style = 'hands_on',
      weekly_learning_hours = 10,
      target_completion_date = null,
      preferred_language = 'English',
      current_occupation = 'Developer Trainee',
      education_level = 'Bachelor Degree',
      known_skills = ['HTML5', 'CSS3', 'JavaScript', 'Git & GitHub']
    } = data;

    // 1. Insert or update learner_profiles table
    await db.query(`
      INSERT INTO learner_profiles 
      (user_id, experience_level, career_goal, interests, preferred_learning_style, weekly_learning_hours, target_completion_date, preferred_language, current_occupation, education_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      experience_level=VALUES(experience_level),
      career_goal=VALUES(career_goal),
      interests=VALUES(interests),
      preferred_learning_style=VALUES(preferred_learning_style),
      weekly_learning_hours=VALUES(weekly_learning_hours),
      target_completion_date=VALUES(target_completion_date),
      preferred_language=VALUES(preferred_language),
      current_occupation=VALUES(current_occupation),
      education_level=VALUES(education_level)
    `, [userId, experience_level, career_goal, interests, preferred_learning_style, weekly_learning_hours, target_completion_date, preferred_language, current_occupation, education_level]);

    // 2. Map known skills to user_skills table
    const allSkills = await db.query(`SELECT * FROM skills`);
    for (const skillName of known_skills) {
      const match = allSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
      if (match) {
        await db.query(`
          INSERT INTO user_skills (user_id, skill_id, proficiency_score, source)
          VALUES (?, ?, 85, 'self_assessment')
          ON DUPLICATE KEY UPDATE proficiency_score = GREATEST(proficiency_score, 85)
        `, [userId, match.id]);
      }
    }

    // 3. Analyze skill gaps and AI goal structure
    const goalAnalysis = await AIService.analyzeGoal(career_goal, userId);
    const gapAnalysis = await SkillGapService.analyzeSkillGap(userId);

    return {
      userId,
      profile: {
        experience_level,
        career_goal,
        interests,
        preferred_learning_style,
        weekly_learning_hours,
      },
      goalAnalysis,
      gapAnalysis,
    };
  }

  /**
   * Get user profile details
   */
  static async getProfile(userId) {
    const profiles = await db.query(`SELECT p.*, u.name, u.email, u.avatar FROM learner_profiles p JOIN users u ON p.user_id = u.id WHERE p.user_id = ?`, [userId]);
    if (profiles.length === 0) {
      const users = await db.query(`SELECT id, name, email, avatar FROM users WHERE id = ?`, [userId]);
      return { user: users[0], profile: null };
    }
    return profiles[0];
  }
}

module.exports = ProfilingService;
