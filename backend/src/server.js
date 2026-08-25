const app = require('./app');
const config = require('./config/env');
const db = require('./config/db');

const PORT = config.port || 5000;

async function startServer() {
  try {
    console.log('🚀 Initializing PathFinder AI Core Backend...');
    
    // Auto DB creation, Table DDL creation & Auto-seeding
    await db.initDatabase();

    const server = app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`🌐 PathFinder AI API running on http://localhost:${PORT}`);
      console.log(`🤖 AI Target URL: ${config.ai.apiUrl}`);
      console.log(`⚡ XAMPP MySQL Auto-Management Active.`);
      console.log(`==================================================`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use by another process.`);
        console.error(`💡 Tip: Close the process using port ${PORT} or run: npx kill-port ${PORT}`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', err);
      }
    });

  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  }
}

startServer();
