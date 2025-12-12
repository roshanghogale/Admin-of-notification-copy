const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const { fixSequence } = require('../util/database');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'OneRoadMap',
  password: process.env.DB_PASSWORD || 'roshan',
  port: process.env.DB_PORT || 5432,
});

const createStudyMaterial = async (req, res) => {
  try {
    const { title, type } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Type is required' });
    }

    let imageUrl = null;
    let pdfUrl = null;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files) {
      if (req.files.image) {
        imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.pdf) {
        pdfUrl = `${baseUrl}/uploads/${req.files.pdf[0].filename}`;
      }
    }

    // Fix sequence before insert
    await fixSequence(pool, 'study_materials');
    
    const result = await pool.query(`
      INSERT INTO study_materials (
        title, type, image_url, pdf_url, created_at
      ) VALUES ($1, $2, $3, $4, NOW()) 
      RETURNING *
    `, [
      title.trim(),
      type.trim(),
      imageUrl,
      pdfUrl
    ]);

    const studyMaterial = result.rows[0];
    
    if (req.body.notification === 'true' || req.body.notification === true) {
      try {
        const NotificationService = require('../service/NotificationService');
        await NotificationService.sendNotificationToTopic(
          'all',
          studyMaterial.title,
          `New ${type.toUpperCase()} study material available`,
          studyMaterial.image_url || '',
          studyMaterial.id.toString()
        );
      } catch (notificationError) {
        console.error('Notification failed:', notificationError);
      }
    }
    
    res.status(201).json({ 
      message: 'Study material created successfully', 
      studyMaterial: studyMaterial 
    });
  } catch (error) {
    console.error('Error creating study material:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStudyMaterials = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM study_materials ORDER BY created_at DESC'
    );
    
    res.status(200).json({ studyMaterials: result.rows });
  } catch (error) {
    console.error('Error fetching study materials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStudyMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM study_materials WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Study material not found' });
    }
    
    res.status(200).json({ studyMaterial: result.rows[0] });
  } catch (error) {
    console.error('Error fetching study material:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateStudyMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingResult = await pool.query('SELECT * FROM study_materials WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Study material not found' });
    }
    
    const existingMaterial = existingResult.rows[0];
    let imageUrl = req.body.image_url || existingMaterial.image_url;
    let pdfUrl = req.body.pdf_url || existingMaterial.pdf_url;
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files) {
      if (req.files.image) {
        imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.pdf) {
        pdfUrl = `${baseUrl}/uploads/${req.files.pdf[0].filename}`;
      }
    }
    
    const result = await pool.query(`
      UPDATE study_materials SET 
        title = $1, type = $2, image_url = $3, pdf_url = $4, updated_at = NOW()
      WHERE id = $5 RETURNING *
    `, [
      req.body.title || existingMaterial.title,
      req.body.type || existingMaterial.type,
      imageUrl,
      pdfUrl,
      id
    ]);
    
    res.status(200).json({ 
      message: 'Study material updated successfully', 
      studyMaterial: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating study material:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteStudyMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    
    const materialResult = await pool.query('SELECT * FROM study_materials WHERE id = $1', [id]);
    
    if (materialResult.rows.length === 0) {
      return res.status(404).json({ error: 'Study material not found' });
    }
    
    const material = materialResult.rows[0];
    
    await pool.query('DELETE FROM study_materials WHERE id = $1', [id]);
    
    const fileFields = ['image_url', 'pdf_url'];
    fileFields.forEach(field => {
      if (material[field] && material[field].includes('/uploads/')) {
        const fileName = material[field].split('/uploads/')[1];
        const filePath = path.join(__dirname, '../../uploads', fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });
    
    res.status(200).json({ message: 'Study material deleted successfully' });
  } catch (error) {
    console.error('Error deleting study material:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const initializeStudyMaterialsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS study_materials (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        image_url VARCHAR(500),
        pdf_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Fix sequence issue by setting it to the correct next value
    await pool.query(`
      SELECT setval('study_materials_id_seq', COALESCE((SELECT MAX(id) FROM study_materials), 0) + 1, false)
    `);
    
    console.log('Study materials table initialized and sequence fixed');
  } catch (error) {
    console.error('Error initializing study materials table:', error);
  }
};

module.exports = { createStudyMaterial, getStudyMaterials, getStudyMaterialById, updateStudyMaterial, deleteStudyMaterial, initializeStudyMaterialsTable };