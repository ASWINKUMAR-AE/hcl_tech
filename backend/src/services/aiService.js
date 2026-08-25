const axios = require('axios');
const config = require('../config/env');
const logger = require('../utils/logger');

/**
 * AI Service Layer - Proxy for Hosit AI API with deterministic fallback capabilities.
 */
class AIService {
  /**
   * Send prompt to Hosit AI API with local fallback & short context payload
   */
  static async sendAIRequest(prompt, userId = 'guest', context = '') {
    // Keep context concise for fast Hosit AI microservice processing
    const cleanContext = typeof context === 'string' ? context.slice(0, 300) : '';
    
    const payload = {
      message: prompt,
      user_id: String(userId),
      context: cleanContext,
    };

    const urlsToTry = [config.ai.apiUrl, config.ai.apiLocalUrl];

    for (const url of urlsToTry) {
      try {
        logger.info(`Sending request to AI Service at ${url}`);
        const response = await axios.post(url, payload, {
          timeout: 15000, // 15s timeout for AI response generation
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.data && (response.data.ai_response || response.data.response || response.data.message)) {
          return response.data.ai_response || response.data.response || response.data.message;
        }
      } catch (err) {
        logger.warn(`AI endpoint ${url} failed or timed out: ${err.message}`);
      }
    }

    logger.warn('External AI endpoints unreachable/timing out. Using intelligent fallback engine.');
    return null; // Signals caller to use deterministic fallback engine
  }

  /**
   * Analyze Learner Goal to extract key target skills & career track
   */
  static async analyzeGoal(goalText, userId) {
    const prompt = `Analyze developer goal: "${goalText}". Return ONLY JSON: {"careerGoal": string, "targetSkills": string[], "prerequisites": string[], "estimatedTimelineMonths": number, "summary": string}`;

    const aiRes = await this.sendAIRequest(prompt, userId, goalText);
    
    if (aiRes) {
      try {
        const cleanJson = aiRes.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanJson);
      } catch (e) {
        logger.warn('Failed to parse AI JSON for goal analysis. Using heuristic fallback.');
      }
    }

    // Deterministic Heuristic Fallback
    const lowerGoal = goalText.toLowerCase();
    let targetSkills = ['HTML5', 'CSS3', 'JavaScript', 'Git & GitHub'];
    let careerGoal = 'Full Stack Web Developer';

    if (lowerGoal.includes('react') || lowerGoal.includes('web') || lowerGoal.includes('full stack') || lowerGoal.includes('frontend')) {
      targetSkills = ['HTML5', 'CSS3', 'JavaScript', 'Git & GitHub', 'React.js', 'Node.js', 'Express.js', 'MySQL', 'RESTful APIs'];
      careerGoal = 'Full Stack Web Developer (React + Node.js)';
    } else if (lowerGoal.includes('backend') || lowerGoal.includes('node') || lowerGoal.includes('api')) {
      targetSkills = ['JavaScript', 'Node.js', 'Express.js', 'MySQL', 'RESTful APIs', 'Web Security & JWT', 'Docker'];
      careerGoal = 'Backend Software Engineer';
    } else if (lowerGoal.includes('devops') || lowerGoal.includes('cloud')) {
      targetSkills = ['Git & GitHub', 'Docker', 'CI/CD Pipelines', 'System Design', 'Node.js'];
      careerGoal = 'DevOps & Cloud Engineer';
    }

    return {
      careerGoal,
      targetSkills,
      prerequisites: ['HTML5', 'CSS3', 'JavaScript'],
      estimatedTimelineMonths: 6,
      summary: `Extracted ${targetSkills.length} key competencies for target track: ${careerGoal}.`,
    };
  }

  /**
   * Explain recommendation reasoning for why a course/resource was suggested
   */
  static async explainRecommendation(userContext, resource) {
    const prompt = `Explain in 2 sentences why "${resource.title}" (${resource.category}) is recommended for a ${userContext.career_goal || 'Web Developer'}.`;

    const aiRes = await this.sendAIRequest(prompt, userContext.user_id || 'guest', userContext.career_goal || '');
    if (aiRes) return aiRes;

    return `"${resource.title}" is recommended because ${resource.category} is a direct prerequisite for your target goal (${userContext.career_goal || 'Web Development'}). Completing this step unlocks your next milestone.`;
  }

  /**
   * Dynamic learning path explanation
   */
  static async explainPath(userGoal, steps) {
    const prompt = `Briefly explain why this step-by-step roadmap fits goal: "${userGoal}".`;

    const aiRes = await this.sendAIRequest(prompt, 'system', userGoal);
    if (aiRes) return aiRes;

    return `This 10-phase learning roadmap is structured sequentially to take you from web foundations (HTML, CSS, JavaScript) to full stack production capstones for "${userGoal}".`;
  }

  /**
   * Conversational Assistant with Full Learner Context & Intelligent Fallbacks
   */
  static async chat(userMessage, userContext) {
    const conciseContext = `Learner Goal: ${userContext.career_goal || 'Web Development'}. Active step: ${userContext.current_step || 'React 18 Architecture'}.`;
    const prompt = `User ask: "${userMessage}". Give concise helpful tech advice.`;

    const aiRes = await this.sendAIRequest(prompt, userContext.user_id || 'guest', conciseContext);
    if (aiRes) return aiRes;

    // Rich Deterministic Assistant Engine for Web Development & Roadmaps
    const lower = userMessage.toLowerCase();

    if (lower.includes('roadmap') || lower.includes('web development') || lower.includes('path') || lower.includes('how to start') || lower.includes('guide')) {
      return `Here is your optimal 4-Stage Web Development Roadmap:\n\n` +
             `1. **Foundations**: HTML5, CSS3, JavaScript (ES6+), Git & GitHub.\n` +
             `2. **Frontend Framework**: React.js 18, State Management (Zustand/Redux), Tailwind CSS.\n` +
             `3. **Backend & Database**: Node.js, Express.js framework, MySQL / PostgreSQL relational databases, REST API design.\n` +
             `4. **Production**: Web Security (JWT, CORS), Unit Testing (Jest), and Cloud Deployment.\n\n` +
             `You can generate your custom interactive version in the **Goal Profiler** tab!`;
    }

    if (lower.includes('node') && lower.includes('express')) {
      return 'Node.js is the JavaScript runtime environment for executing server-side code. Express.js is a web framework built on top of Node.js. Learning Node core fundamentals first makes Express routing and middleware much simpler to understand!';
    }

    if (lower.includes('react') || lower.includes('frontend')) {
      return 'React 18 is the leading frontend component library. Master JavaScript primitives (arrays, functions, promises, destructing) first, then component state (`useState`), side effects (`useEffect`), and API integrations.';
    }

    if (lower.includes('mysql') || lower.includes('database') || lower.includes('sql')) {
      return 'MySQL handles persistent relational data storage. In your web stack, Node/Express connects to MySQL to perform CRUD operations (SELECT, INSERT, UPDATE, DELETE) for user profiles and learning progress.';
    }

    if (lower.includes('why') || lower.includes('recommend')) {
      return `PathFinder AI sequences your roadmap based on prerequisite graph dependencies. Foundational skills (HTML, CSS, JS) must be verified before advanced backend frameworks or full stack capstones are unlocked.`;
    }

    return `PathFinder AI Assistant: For your goal of **${userContext.career_goal || 'Web Development'}**, your active step is **${userContext.current_step || 'React 18 Architecture & Hooks'}**. Ask me about prerequisites, roadmap stages, or specific technologies!`;
  }
}

module.exports = AIService;
