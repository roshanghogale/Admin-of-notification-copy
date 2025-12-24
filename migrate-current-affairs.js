const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'OneRoadMap',
  password: process.env.DB_PASSWORD || 'roshan',
  port: process.env.DB_PORT || 5432,
});

async function migrateCurrentAffairsTable() {
  try {
    console.log('Starting current_affairs table migration...');
    
    // Add missing columns if they don't exist
    await pool.query(`
      ALTER TABLE current_affairs 
      ADD COLUMN IF NOT EXISTS date DATE,
      ADD COLUMN IF NOT EXISTS image_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS scheduled_notification_date DATE,
      ADD COLUMN IF NOT EXISTS notification_sent BOOLEAN DEFAULT FALSE
    `);
    
    console.log('Current affairs table migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrateCurrentAffairsTable();