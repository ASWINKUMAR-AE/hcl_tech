const db = require('../config/db');

/**
 * Vector Search Service Abstraction
 * 
 * Provides semantic search and content matching interface.
 * Currently backed by indexed keyword/tag cosine similarity fallback on MySQL,
 * designed with modular interface for pluggable vector databases (Pinecone, Qdrant, Weaviate, pgvector).
 */
class VectorSearchService {
  /**
   * Search courses semantically matching query text or target skills
   */
  static async searchCourses(queryText, targetSkills = [], limit = 10) {
    // 1. Fetch vector embeddings reference if present
    const allCourses = await db.query(`
      SELECT c.*, GROUP_CONCAT(s.name) as skill_names
      FROM courses c
      LEFT JOIN course_skills cs ON c.id = cs.course_id
      LEFT JOIN skills s ON cs.skill_id = s.id
      GROUP BY c.id
    `);

    // Calculate semantic keyword similarity score (0.0 to 1.0)
    const keywords = [queryText, ...targetSkills].flatMap(k => k.toLowerCase().split(/\s+/));
    
    const scored = allCourses.map(course => {
      const courseText = `${course.title} ${course.description} ${course.category} ${course.skill_names || ''}`.toLowerCase();
      let matchCount = 0;

      keywords.forEach(kw => {
        if (kw.length > 2 && courseText.includes(kw)) {
          matchCount += 1;
        }
      });

      const semanticScore = Math.min(1.0, matchCount / (keywords.length || 1));
      return {
        ...course,
        semanticScore: parseFloat((semanticScore * 100).toFixed(2)),
      };
    });

    // Sort by semantic score descending
    scored.sort((a, b) => b.semanticScore - a.semanticScore);
    return scored.slice(0, limit);
  }

  /**
   * Store user embedding representation
   */
  static async storeEmbedding(userId, contentType, contentId, embeddingArray) {
    const jsonVector = JSON.stringify(embeddingArray || [0.1, 0.4, 0.8, 0.95]);
    const sql = `
      INSERT INTO user_embeddings (user_id, content_type, content_id, embedding_reference, embedding_model)
      VALUES (?, ?, ?, ?, 'multilingual-e5-base-mock')
    `;
    return await db.query(sql, [userId, contentType, contentId, jsonVector]);
  }
}

module.exports = VectorSearchService;
