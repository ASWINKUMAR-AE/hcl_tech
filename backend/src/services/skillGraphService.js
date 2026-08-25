const db = require('../config/db');

class SkillGraphService {
  /**
   * Get all prerequisites for a specific skill
   */
  static async getPrerequisites(skillId) {
    const sql = `
      SELECT sp.prerequisite_skill_id, s.name, s.category, s.difficulty_level, sp.relationship_strength
      FROM skill_prerequisites sp
      JOIN skills s ON sp.prerequisite_skill_id = s.id
      WHERE sp.skill_id = ?
    `;
    return await db.query(sql, [skillId]);
  }

  /**
   * Get full prerequisite chain recursively
   */
  static async getPrerequisiteChain(skillId, visited = new Set()) {
    if (visited.has(skillId)) return [];
    visited.add(skillId);

    const directPrereqs = await this.getPrerequisites(skillId);
    let chain = [...directPrereqs];

    for (const prereq of directPrereqs) {
      const subChain = await this.getPrerequisiteChain(prereq.prerequisite_skill_id, visited);
      chain = chain.concat(subChain);
    }
    return chain;
  }

  /**
   * Check if a user meets all prerequisites for a target skill
   * Returns { satisfied: boolean, missingPrerequisites: [] }
   */
  static async checkPrerequisitesSatisfied(userId, skillId) {
    const prereqs = await this.getPrerequisites(skillId);
    if (prereqs.length === 0) return { satisfied: true, missingPrerequisites: [] };

    // Get user skills with proficiency >= 60
    const userSkills = await db.query(
      `SELECT skill_id, proficiency_score FROM user_skills WHERE user_id = ? AND proficiency_score >= 60`,
      [userId]
    );
    const userSkillIds = new Set(userSkills.map(us => us.skill_id));

    const missing = prereqs.filter(p => !userSkillIds.has(p.prerequisite_skill_id));
    return {
      satisfied: missing.length === 0,
      missingPrerequisites: missing,
    };
  }

  /**
   * Topologically sort a set of skills based on prerequisites
   */
  static async sortSkillsByPrerequisites(skillIds) {
    if (!skillIds || skillIds.length === 0) return [];

    const allPrereqs = await db.query(
      `SELECT skill_id, prerequisite_skill_id FROM skill_prerequisites WHERE skill_id IN (?) OR prerequisite_skill_id IN (?)`,
      [skillIds, skillIds]
    );

    const graph = new Map();
    const inDegree = new Map();

    skillIds.forEach(id => {
      graph.set(id, []);
      inDegree.set(id, 0);
    });

    allPrereqs.forEach(({ skill_id, prerequisite_skill_id }) => {
      if (graph.has(prerequisite_skill_id) && graph.has(skill_id)) {
        graph.get(prerequisite_skill_id).push(skill_id);
        inDegree.set(skill_id, (inDegree.get(skill_id) || 0) + 1);
      }
    });

    const queue = [];
    inDegree.forEach((degree, id) => {
      if (degree === 0) queue.push(id);
    });

    const sorted = [];
    while (queue.length > 0) {
      const current = queue.shift();
      sorted.push(current);

      const neighbors = graph.get(current) || [];
      neighbors.forEach(neighbor => {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      });
    }

    // Append any remaining skills that were part of cycles or missed
    skillIds.forEach(id => {
      if (!sorted.includes(id)) sorted.push(id);
    });

    return sorted;
  }
}

module.exports = SkillGraphService;
