const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const config = require('./env');

let pool = null;

async function initDatabase() {
  try {
    // 1. Create root connection (without database) to ensure DB exists
    const rootConnection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      multipleStatements: true,
    });

    console.log('🔄 Connected to MySQL Server. Checking database existence...');
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConnection.end();

    // 2. Create pool with database target
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 15,
      queueLimit: 0,
      multipleStatements: true,
    });

    // 3. Auto-run schema.sql to guarantee table creation
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('✅ Database schema verified/initialized successfully.');
    }

    // 4. Check if demo seeding is needed
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      console.log('🌱 Seeding initial demo skills, courses, projects, assessments, and demo user...');
      const seedPath = path.join(__dirname, '../../../database/seed.sql');
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await pool.query(seedSql);
        console.log('✅ Demo seed data applied successfully!');
      }
    } else {
      console.log(`ℹ️ Database '${config.db.database}' already initialized with existing data (${rows[0].count} users).`);
    }

  } catch (error) {
    console.error('❌ Database Initialization Error:', error.message);
    console.error('⚠️ Ensure XAMPP MySQL / Apache is running on port 3306.');
  }
}

// Helper wrapper for SQL queries
async function query(sql, params = []) {
  if (!pool) {
    throw new Error('Database pool has not been initialized.');
  }
  const [results] = await pool.query(sql, params);
  return results;
}

module.exports = {
  initDatabase,
  query,
  getPool: () => pool,
};
