require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'OneRoadMap',
  password: process.env.DB_PASSWORD || 'roshan',
  port: process.env.DB_PORT || 5432,
});

async function migrateStudentUpdatesTable() {
  try {
    // Check if columns exist and add them if they don't
    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'student_updates'
    `);
    
    const existingColumns = checkColumns.rows.map(row => row.column_name);
    
    const columnsToAdd = [
      { name: 'icon_url', type: 'VARCHAR(255)' },
      { name: 'notification_pdf_url', type: 'VARCHAR(255)' },
      { name: 'selection_pdf_url', type: 'VARCHAR(255)' }
    ];
    
    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        await pool.query(`ALTER TABLE student_updates ADD COLUMN ${column.name} ${column.type}`);
        console.log(`Added column: ${column.name}`);
      } else {
        console.log(`Column ${column.name} already exists`);
      }
    }
    
    console.log('Student updates table migration completed successfully');
  } catch (error) {
    console.error('Error migrating student updates table:', error);
  } finally {
    await pool.end();
  }
}

migrateStudentUpdatesTable();