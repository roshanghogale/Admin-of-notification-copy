const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const { parseJsonField } = require('../util/jsonHelper');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'OneRoadMap',
  password: process.env.DB_PASSWORD || 'roshan',
  port: process.env.DB_PORT || 5432,
});

const createStudentUpdate = async (req, res) => {
  try {
    const { 
      title, education, ageRestriction, applicationMethod, 
      description2, applicationLink, lastDate, notification 
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    let imageUrl = null;
    let notificationPdfUrl = null;
    let selectionPdfUrl = null;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files) {
      if (req.files.image) {
        imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.notificationPdf) {
        notificationPdfUrl = `${baseUrl}/uploads/${req.files.notificationPdf[0].filename}`;
      }
      if (req.files.selectionPdf) {
        selectionPdfUrl = `${baseUrl}/uploads/${req.files.selectionPdf[0].filename}`;
      }
    }

    const parsedLastDate = lastDate && lastDate.trim() && lastDate !== 'null' ? new Date(lastDate) : null;

    const result = await pool.query(`
      INSERT INTO student_updates (
        title, education, age_restriction, application_method, description, 
        application_link, last_date, image_url, notification_pdf_url, 
        selection_pdf_url, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()) 
      RETURNING *
    `, [
      title.trim(),
      education?.trim() || '',
      ageRestriction?.trim() || '',
      applicationMethod?.trim() || '',
      description2?.trim() || '',
      applicationLink?.trim() || '',
      parsedLastDate,
      imageUrl,
      notificationPdfUrl,
      selectionPdfUrl
    ]);

    const studentUpdate = result.rows[0];
    
    if (notification === 'true' || notification === true) {
      try {
        const NotificationService = require('../service/NotificationService');
        await NotificationService.sendNotificationToTopic(
          'all',
          title.trim(),
          education || 'New student update available',
          imageUrl || '',
          studentUpdate.id.toString()
        );
      } catch (notificationError) {
        console.error('Notification failed:', notificationError);
      }
    }
    
    res.status(201).json({ 
      message: 'Student update created successfully', 
      studentUpdate: studentUpdate 
    });
  } catch (error) {
    console.error('Error creating student update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStudentUpdates = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM student_updates ORDER BY created_at DESC'
    );
    
    res.status(200).json({ studentUpdates: result.rows });
  } catch (error) {
    console.error('Error fetching student updates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStudentUpdateById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM student_updates WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student update not found' });
    }
    
    res.status(200).json({ studentUpdate: result.rows[0] });
  } catch (error) {
    console.error('Error fetching student update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteStudentUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM student_updates WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student update not found' });
    }
    
    const studentUpdate = result.rows[0];
    
    const fileFields = ['image_url', 'notification_pdf_url', 'selection_pdf_url'];
    fileFields.forEach(field => {
      if (studentUpdate[field]) {
        try {
          const url = studentUpdate[field];
          const filename = url.split('/uploads/')[1];
          if (filename) {
            const filePath = path.join(__dirname, '../../uploads', filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        } catch (fileError) {
          console.error(`Error deleting file for ${field}:`, fileError);
        }
      }
    });
    
    await pool.query('DELETE FROM student_updates WHERE id = $1', [id]);
    
    res.status(200).json({ message: 'Student update deleted successfully' });
  } catch (error) {
    console.error('Error deleting student update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateStudentUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    if (updateData.title !== undefined) {
      fields.push(`title = $${paramCount}`);
      values.push(updateData.title);
      paramCount++;
    }
    
    if (updateData.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(JSON.stringify(updateData.description));
      paramCount++;
    }
    
    if (updateData.image_url !== undefined) {
      fields.push(`image_url = $${paramCount}`);
      values.push(updateData.image_url);
      paramCount++;
    }
    
    if (updateData.pdf_url !== undefined) {
      fields.push(`pdf_url = $${paramCount}`);
      values.push(updateData.pdf_url);
      paramCount++;
    }
    
    values.push(id);
    
    const result = await pool.query(`
      UPDATE student_updates SET 
        ${fields.join(', ')}
      WHERE id = $${paramCount} RETURNING *
    `, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student update not found' });
    }
    
    res.status(200).json({ 
      message: 'Student update updated successfully', 
      studentUpdate: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating student update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const initializeStudentUpdatesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_updates (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        education VARCHAR(255),
        age_restriction VARCHAR(255),
        application_method VARCHAR(255),
        description TEXT,
        application_link TEXT,
        last_date DATE,
        image_url VARCHAR(255),
        notification_pdf_url VARCHAR(255),
        selection_pdf_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    console.log('Student updates table initialized');
  } catch (error) {
    console.error('Error initializing student updates table:', error);
  }
};

module.exports = { createStudentUpdate, getStudentUpdates, getStudentUpdateById, deleteStudentUpdate, updateStudentUpdate, initializeStudentUpdatesTable };