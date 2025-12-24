require('dotenv').config();
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
    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'stories'
    `);
    
    const existingColumns = checkColumns.rows.map(row => row.column_name);
    
    const columnsToAdd = [
      { name: 'video_url', type: 'VARCHAR(500)' },
      { name: 'media_type', type: 'VARCHAR(20) DEFAULT \'image\'' }
    ];
    
    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        await pool.query(`ALTER TABLE stories ADD COLUMN ${column.name} ${column.type}`);
        console.log(`Added column: ${column.name}`);
      } else {
        console.log(`Column ${column.name} already exists`);
      }
    }
    
    console.log('Stories table migration completed successfully');
  } catch (error) {
    console.error('Error migrating stories table:', error);
  } finally {
    await pool.end();
  }
}

migrateStoriesTable();