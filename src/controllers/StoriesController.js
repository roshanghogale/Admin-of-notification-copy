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

const createStory = async (req, res) => {
  try {
    const { title, postDocumentId, webUrl, type, otherType, isMainStory, educationCategories, bachelorDegrees, mastersDegrees, selectedDistrict, selectedTaluka } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    let iconUrl = null;
    let bannerUrl = null;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files) {
      if (req.files.icon) {
        iconUrl = `${baseUrl}/uploads/${req.files.icon[0].filename}`;
      }
      if (req.files.banner) {
        bannerUrl = `${baseUrl}/uploads/${req.files.banner[0].filename}`;
      }
    }

    const result = await pool.query(`
      INSERT INTO stories (
        title, post_document_id, web_url, type, other_type, is_main_story,
        education_categories, bachelor_degrees, masters_degrees, district, taluka,
        icon_url, banner_url, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW()) 
      RETURNING *
    `, [
      title.trim(),
      type === 'promotion' ? null : (postDocumentId?.trim() || null),
      type === 'promotion' ? (webUrl?.trim() || null) : null,
      type?.trim() || '',
      otherType?.trim() || '',
      isMainStory === 'true' || isMainStory === true,
      JSON.stringify(parseJsonField(educationCategories) || []),
      JSON.stringify(parseJsonField(bachelorDegrees) || []),
      JSON.stringify(parseJsonField(mastersDegrees) || []),
      selectedDistrict?.trim() || '',
      selectedTaluka?.trim() || '',
      iconUrl,
      bannerUrl
    ]);

    const story = result.rows[0];
    
    if (req.body.notification === 'true' || req.body.notification === true) {
      try {
        const NotificationService = require('../service/NotificationService');
        await NotificationService.sendNotificationToTopic(
          'all',
          story.title,
          'New story available',
          story.icon_url || '',
          story.id.toString()
        );
      } catch (notificationError) {
        console.error('Notification failed:', notificationError);
      }
    }
    
    res.status(201).json({ 
      message: 'Story created successfully', 
      story: story 
    });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM stories ORDER BY created_at DESC'
    );
    
    res.status(200).json({ stories: result.rows });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM stories WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    res.status(200).json({ story: result.rows[0] });
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingResult = await pool.query('SELECT * FROM stories WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    const existingStory = existingResult.rows[0];
    let iconUrl = req.body.icon_url || existingStory.icon_url;
    let bannerUrl = req.body.banner_url || existingStory.banner_url;
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files) {
      if (req.files.icon) {
        iconUrl = `${baseUrl}/uploads/${req.files.icon[0].filename}`;
      }
      if (req.files.banner) {
        bannerUrl = `${baseUrl}/uploads/${req.files.banner[0].filename}`;
      }
    }
    
    // Handle JSON fields properly
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
      UPDATE stories SET 
        title = $1, post_document_id = $2, web_url = $3, type = $4, other_type = $5,
        is_main_story = $6, education_categories = $7, bachelor_degrees = $8, 
        masters_degrees = $9, district = $10, taluka = $11, icon_url = $12, 
        banner_url = $13, updated_at = NOW()
      WHERE id = $14 RETURNING *
    `, [
      req.body.title || existingStory.title,
      req.body.post_document_id || existingStory.post_document_id,
      req.body.web_url || existingStory.web_url,
      req.body.type || existingStory.type,
      req.body.other_type || existingStory.other_type,
      req.body.is_main_story !== undefined ? req.body.is_main_story : existingStory.is_main_story,
      parseJsonField(req.body.education_categories, existingStory.education_categories),
      parseJsonField(req.body.bachelor_degrees, existingStory.bachelor_degrees),
      parseJsonField(req.body.masters_degrees, existingStory.masters_degrees),
      req.body.district || existingStory.district,
      req.body.taluka || existingStory.taluka,
      iconUrl,
      bannerUrl,
      id
    ]);
    
    res.status(200).json({ 
      message: 'Story updated successfully', 
      story: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const storyResult = await pool.query('SELECT * FROM stories WHERE id = $1', [id]);
    
    if (storyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    const story = storyResult.rows[0];
    
    await pool.query('DELETE FROM stories WHERE id = $1', [id]);
    
    const fileFields = ['icon_url', 'banner_url'];
    fileFields.forEach(field => {
      if (story[field] && story[field].includes('/uploads/')) {
        const fileName = story[field].split('/uploads/')[1];
        const filePath = path.join(__dirname, '../../uploads', fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });
    
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const initializeStoriesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        post_document_id VARCHAR(255),
        web_url VARCHAR(500),
        type VARCHAR(100),
        other_type VARCHAR(100),
        is_main_story BOOLEAN DEFAULT false,
        education_categories JSONB,
        bachelor_degrees JSONB,
        masters_degrees JSONB,
        district VARCHAR(100),
        taluka VARCHAR(100),
        icon_url VARCHAR(500),
        banner_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    console.log('Stories table initialized');
  } catch (error) {
    console.error('Error initializing stories table:', error);
  }
};

module.exports = { createStory, getStories, getStoryById, updateStory, deleteStory, initializeStoriesTable };