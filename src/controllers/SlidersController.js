const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const { parseJsonField } = require('../util/jsonHelper');
const { fixSequence } = require('../util/database');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'OneRoadMap',
  password: process.env.DB_PASSWORD || 'roshan',
  port: process.env.DB_PORT || 5432,
});

const createSlider = async (req, res) => {
  try {
    const { title, postDocumentId, webUrl, type, pageType, isSpecific, otherType, educationCategories, bachelorDegrees, mastersDegrees, selectedDistrict, selectedTaluka } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    let imageUrl = null;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files && req.files.image) {
      imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
    }

    // Fix sequence before insert
    await fixSequence(pool, 'sliders');
    
    const result = await pool.query(`
      INSERT INTO sliders (
        title, post_document_id, web_url, type, page_type, is_specific,
        other_type, education_categories, bachelor_degrees, masters_degrees, 
        district, taluka, age_groups, image_url, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW()) 
      RETURNING *
    `, [
      title.trim(),
      type === 'promotion' ? null : (postDocumentId?.trim() || null),
      type === 'promotion' ? (webUrl?.trim() || null) : null,
      type?.trim() || '',
      pageType?.trim() || '',
      isSpecific === 'true' || isSpecific === true,
      otherType?.trim() || '',
      JSON.stringify(parseJsonField(educationCategories) || []),
      JSON.stringify(parseJsonField(bachelorDegrees) || []),
      JSON.stringify(parseJsonField(mastersDegrees) || []),
      JSON.stringify(parseJsonField(selectedDistrict) || []),
      JSON.stringify(parseJsonField(selectedTaluka) || []),
      JSON.stringify(parseJsonField(req.body.ageGroups) || []),
      imageUrl
    ]);

    const slider = result.rows[0];
    
    if (req.body.notification === 'true' || req.body.notification === true) {
      try {
        const NotificationService = require('../service/NotificationService');
        await NotificationService.sendNotificationToTopic(
          'all',
          slider.title,
          'New slider available',
          slider.image_url || '',
          slider.id.toString()
        );
      } catch (notificationError) {
        console.error('Notification failed:', notificationError);
      }
    }
    
    res.status(201).json({ 
      message: 'Slider created successfully', 
      slider: slider 
    });
  } catch (error) {
    console.error('Error creating slider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSliders = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM sliders ORDER BY created_at DESC'
    );
    
    res.status(200).json({ sliders: result.rows });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSliderById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM sliders WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Slider not found' });
    }
    
    res.status(200).json({ slider: result.rows[0] });
  } catch (error) {
    console.error('Error fetching slider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getHomeSliders = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sliders WHERE LOWER(page_type) = 'home' ORDER BY created_at DESC"
    );
    
    res.status(200).json({ sliders: result.rows });
  } catch (error) {
    console.error('Error fetching home sliders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBankingSliders = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sliders WHERE LOWER(page_type) = 'banking jobs' ORDER BY created_at DESC"
    );
    
    res.status(200).json({ sliders: result.rows });
  } catch (error) {
    console.error('Error fetching banking sliders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getGovernmentSliders = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sliders WHERE LOWER(page_type) = 'government jobs' ORDER BY created_at DESC"
    );
    
    res.status(200).json({ sliders: result.rows });
  } catch (error) {
    console.error('Error fetching government sliders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPrivateSliders = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM sliders WHERE LOWER(page_type) = 'private jobs' ORDER BY created_at DESC"
    );
    
    res.status(200).json({ sliders: result.rows });
  } catch (error) {
    console.error('Error fetching private sliders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingResult = await pool.query('SELECT * FROM sliders WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Slider not found' });
    }
    
    const existingSlider = existingResult.rows[0];
    let imageUrl = req.body.image_url || existingSlider.image_url;
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files && req.files.image) {
      imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
    }
    
    const parseJsonField = (field, fallback) => {
      if (typeof field === 'string') {
        try {
          return JSON.stringify(JSON.parse(field));
        } catch {
          return JSON.stringify([field]);
        }
      }
      return field || fallback;
    };
    
    const result = await pool.query(`
      UPDATE sliders SET 
        title = $1, post_document_id = $2, web_url = $3, type = $4, page_type = $5,
        is_specific = $6, other_type = $7, education_categories = $8, 
        bachelor_degrees = $9, masters_degrees = $10, district = $11, 
        taluka = $12, age_groups = $13, image_url = $14, updated_at = NOW()
      WHERE id = $15 RETURNING *
    `, [
      req.body.title || existingSlider.title,
      req.body.post_document_id || existingSlider.post_document_id,
      req.body.web_url || existingSlider.web_url,
      req.body.type || existingSlider.type,
      req.body.page_type || existingSlider.page_type,
      req.body.is_specific !== undefined ? req.body.is_specific : existingSlider.is_specific,
      req.body.other_type || existingSlider.other_type,
      parseJsonField(req.body.education_categories, existingSlider.education_categories),
      parseJsonField(req.body.bachelor_degrees, existingSlider.bachelor_degrees),
      parseJsonField(req.body.masters_degrees, existingSlider.masters_degrees),
      req.body.district ? JSON.stringify(parseJsonField(req.body.district) || []) : existingSlider.district,
      req.body.taluka ? JSON.stringify(parseJsonField(req.body.taluka) || []) : existingSlider.taluka,
      req.body.age_groups ? JSON.stringify(parseJsonField(req.body.age_groups) || []) : existingSlider.age_groups,
      imageUrl,
      id
    ]);
    
    res.status(200).json({ 
      message: 'Slider updated successfully', 
      slider: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating slider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    
    const sliderResult = await pool.query('SELECT * FROM sliders WHERE id = $1', [id]);
    
    if (sliderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Slider not found' });
    }
    
    const slider = sliderResult.rows[0];
    
    await pool.query('DELETE FROM sliders WHERE id = $1', [id]);
    
    if (slider.image_url && slider.image_url.includes('/uploads/')) {
      const fileName = slider.image_url.split('/uploads/')[1];
      const filePath = path.join(__dirname, '../../uploads', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(200).json({ message: 'Slider deleted successfully' });
  } catch (error) {
    console.error('Error deleting slider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const initializeSlidersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sliders (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        post_document_id VARCHAR(255),
        web_url VARCHAR(500),
        type VARCHAR(100),
        page_type VARCHAR(100),
        is_specific BOOLEAN DEFAULT false,
        other_type VARCHAR(100),
        education_categories JSONB,
        bachelor_degrees JSONB,
        masters_degrees JSONB,
        district JSONB,
        taluka JSONB,
        age_groups JSONB,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Alter existing table to fix schema inconsistencies
    const migrations = [
      'ALTER TABLE sliders ALTER COLUMN district TYPE JSONB USING district::JSONB',
      'ALTER TABLE sliders ALTER COLUMN taluka TYPE JSONB USING taluka::JSONB',
      'ALTER TABLE sliders ADD COLUMN IF NOT EXISTS age_groups JSONB'
    ];
    
    for (const migration of migrations) {
      try {
        await pool.query(migration);
      } catch (err) {
        // Ignore errors for existing columns or type changes
      }
    }
    
    console.log('Sliders table initialized and schema updated');
  } catch (error) {
    console.error('Error initializing sliders table:', error);
  }
};

module.exports = { createSlider, getSliders, getSliderById, getHomeSliders, getBankingSliders, getGovernmentSliders, getPrivateSliders, updateSlider, deleteSlider, initializeSlidersTable };