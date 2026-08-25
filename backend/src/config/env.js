const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pathfinder_ai',
  },
  jwtSecret: process.env.JWT_SECRET || 'pathfinder_ai_secret_key',
  ai: {
    apiUrl: process.env.AI_API_URL || 'http://106.51.21.4:8000/api/chat',
    apiLocalUrl: process.env.AI_API_LOCAL_URL || 'http://192.168.0.2:8000/api/chat',
    timeout: parseInt(process.env.AI_TIMEOUT, 10) || 30000,
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
