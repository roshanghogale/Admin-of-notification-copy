const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'OneRoadMap',
  password: process.env.DB_PASSWORD || 'roshan',
  port: process.env.DB_PORT || 5432,
});

async function migrateStoriesTable() {
  try {
    console.log('Starting stories table migration...');
    
    // Add age_groups column if it doesn't exist
    await pool.query(`
      ALTER TABLE stories 
      ADD COLUMN IF NOT EXISTS age_groups JSONB DEFAULT '[]'::jsonb
    `);
    
    // Change district and taluka to JSONB if they're not already
    await pool.query(`
      ALTER TABLE stories 
      ALTER COLUMN district TYPE JSONB USING 
        CASE 
          WHEN district = '' OR district IS NULL THEN '[]'::jsonb
          ELSE json_build_array(district)::jsonb
        END
    `);
    
    await pool.query(`
      ALTER TABLE stories 
      ALTER COLUMN taluka TYPE JSONB USING 
        CASE 
          WHEN taluka = '' OR taluka IS NULL THEN '[]'::jsonb
          ELSE json_build_array(taluka)::jsonb
        END
    `);
    
    console.log('Stories table migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrateStoriesTable();