const { pool } = require('../util/database');
const fs = require('fs');
const path = require('path');
const { parseJsonField } = require('../util/jsonHelper');

const createNotificationFilesTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS notification_files (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      image_url VARCHAR(500),
      document_id VARCHAR(100),
      is_specific BOOLEAN DEFAULT false,
      other_type VARCHAR(50),
      education_categories JSONB,
      bachelor_degrees JSONB,
      masters_degrees JSONB,
      district JSONB,
      taluka JSONB,
      age_groups JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await pool.query(createTableQuery);
    
    // Alter existing table to add missing columns and fix types
    const migrations = [
      'ALTER TABLE notification_files ADD COLUMN IF NOT EXISTS age_groups JSONB',
      'ALTER TABLE notification_files ALTER COLUMN district TYPE JSONB USING district::JSONB',
      'ALTER TABLE notification_files ALTER COLUMN taluka TYPE JSONB USING taluka::JSONB'
    ];
    
    for (const migration of migrations) {
      try {
        await pool.query(migration);
      } catch (err) {
        // Ignore errors for existing columns or type changes
      }
    }
    
    console.log('notification_files table created and schema updated successfully');
  } catch (error) {
    console.error('Error creating notification_files table:', error);
  }
};

const getAllNotificationFiles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notification_files ORDER BY created_at DESC');
    res.json({ notificationFiles: result.rows });
  } catch (error) {
    console.error('Error fetching notification files:', error);
    res.status(500).json({ error: 'Failed to fetch notification files' });
  }
};

const createNotificationFile = async (req, res) => {
  try {
    const {
      title,
      body,
      documentId,
      isSpecific,
      otherType,
      educationCategories,
      bachelorDegrees,
      mastersDegrees,
      district,
      taluka,
      ageGroups
    } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const insertQuery = `
      INSERT INTO notification_files (
        title, body, image_url, document_id, is_specific, other_type,
        education_categories, bachelor_degrees, masters_degrees, district, taluka, age_groups
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      title,
      body,
      imageUrl,
      documentId,
      isSpecific === 'true',
      otherType || null,
      educationCategories ? JSON.stringify(parseJsonField(educationCategories) || []) : null,
      bachelorDegrees ? JSON.stringify(parseJsonField(bachelorDegrees) || []) : null,
      mastersDegrees ? JSON.stringify(parseJsonField(mastersDegrees) || []) : null,
      district ? JSON.stringify(parseJsonField(district) || []) : null,
      taluka ? JSON.stringify(parseJsonField(taluka) || []) : null,
      ageGroups ? JSON.stringify(parseJsonField(ageGroups) || []) : null
    ];

    const result = await pool.query(insertQuery, values);
    res.status(201).json({ notificationFile: result.rows[0] });
  } catch (error) {
    console.error('Error creating notification file:', error);
    res.status(500).json({ error: 'Failed to create notification file' });
  }
};

const updateNotificationFile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      body,
      documentId,
      isSpecific,
      otherType,
      educationCategories,
      bachelorDegrees,
      mastersDegrees,
      district,
      taluka,
      ageGroups
    } = req.body;

    const updateQuery = `
      UPDATE notification_files SET
        title = $1, body = $2, document_id = $3, is_specific = $4, other_type = $5,
        education_categories = $6, bachelor_degrees = $7, masters_degrees = $8,
        district = $9, taluka = $10, age_groups = $11
      WHERE id = $12
      RETURNING *
    `;

    const values = [
      title,
      body,
      documentId,
      isSpecific || false,
      otherType || null,
      educationCategories ? JSON.stringify(parseJsonField(educationCategories) || []) : null,
      bachelorDegrees ? JSON.stringify(parseJsonField(bachelorDegrees) || []) : null,
      mastersDegrees ? JSON.stringify(parseJsonField(mastersDegrees) || []) : null,
      district ? JSON.stringify(parseJsonField(district) || []) : null,
      taluka ? JSON.stringify(parseJsonField(taluka) || []) : null,
      ageGroups ? JSON.stringify(parseJsonField(ageGroups) || []) : null,
      id
    ];

    const result = await pool.query(updateQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification file not found' });
    }

    res.json({ notificationFile: result.rows[0] });
  } catch (error) {
    console.error('Error updating notification file:', error);
    res.status(500).json({ error: 'Failed to update notification file' });
  }
};

const deleteNotificationFile = async (req, res) => {
  try {
    const { id } = req.params;

    const selectQuery = 'SELECT * FROM notification_files WHERE id = $1';
    const selectResult = await pool.query(selectQuery, [id]);

    if (selectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Notification file not found' });
    }

    const notificationFile = selectResult.rows[0];

    if (notificationFile.image_url) {
      const filePath = path.join(__dirname, '../../uploads', path.basename(notificationFile.image_url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const deleteQuery = 'DELETE FROM notification_files WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    res.json({ message: 'Notification file deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification file:', error);
    res.status(500).json({ error: 'Failed to delete notification file' });
  }
};

module.exports = {
  createNotificationFilesTable,
  getAllNotificationFiles,
  createNotificationFile,
  updateNotificationFile,
  deleteNotificationFile
};