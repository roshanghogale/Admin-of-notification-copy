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

const createNews = async (req, res) => {
  try {
    const { title, type, date, description1, description2 } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Type is required' });
    }

    let imageUrl = null;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files && req.files.image) {
      imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
    }

    const description = {
      paragraph1: description1?.trim() || '',
      paragraph2: description2?.trim() || ''
    };

    const result = await pool.query(`
      INSERT INTO news (
        title, type, date, description, image_url, created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW()) 
      RETURNING *
    `, [
      title.trim(),
      type.trim(),
      date?.trim() || null,
      JSON.stringify(description),
      imageUrl
    ]);

    const news = result.rows[0];
    
    if (req.body.notification === 'true' || req.body.notification === true) {
      try {
        const NotificationService = require('../service/NotificationService');
        await NotificationService.sendNotificationToTopic(
          'all',
          news.title,
          description.paragraph1 || 'New news update available',
          news.image_url || '',
          news.id.toString()
        );
      } catch (notificationError) {
        console.error('Notification failed:', notificationError);
      }
    }
    
    res.status(201).json({ 
      message: 'News created successfully', 
      news: news 
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getNews = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM news ORDER BY created_at DESC'
    );
    
    res.status(200).json({ news: result.rows });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    res.status(200).json({ news: result.rows[0] });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingResult = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    const existingNews = existingResult.rows[0];
    let imageUrl = req.body.image_url || existingNews.image_url;
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files && req.files.image) {
      imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
    }
    
    const parseJsonField = (field, fallback) => {
      if (typeof field === 'string') {
        try {
          return JSON.stringify(JSON.parse(field));
        } catch {
          return field;
        }
      }
      return field || fallback;
    };
    
    const result = await pool.query(`
      UPDATE news SET 
        title = $1, type = $2, date = $3, description = $4, 
        image_url = $5, updated_at = NOW()
      WHERE id = $6 RETURNING *
    `, [
      req.body.title || existingNews.title,
      req.body.type || existingNews.type,
      req.body.date || existingNews.date,
      parseJsonField(req.body.description, existingNews.description),
      imageUrl,
      id
    ]);
    
    res.status(200).json({ 
      message: 'News updated successfully', 
      news: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    
    const newsResult = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
    
    if (newsResult.rows.length === 0) {
      return res.status(404).json({ error: 'News not found' });
    }
    
    const news = newsResult.rows[0];
    
    await pool.query('DELETE FROM news WHERE id = $1', [id]);
    
    if (news.image_url && news.image_url.includes('/uploads/')) {
      const fileName = news.image_url.split('/uploads/')[1];
      const filePath = path.join(__dirname, '../../uploads', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(200).json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const initializeNewsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        date VARCHAR(50),
        description JSONB,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Migration to replace web_url with date
    const migrations = [
      'ALTER TABLE news ADD COLUMN IF NOT EXISTS date VARCHAR(50)',
      'ALTER TABLE news DROP COLUMN IF EXISTS web_url'
    ];
    
    for (const migration of migrations) {
      try {
        await pool.query(migration);
      } catch (err) {
        // Ignore errors for existing columns
      }
    }
    
    console.log('News table initialized');
  } catch (error) {
    console.error('Error initializing news table:', error);
  }
};

module.exports = { createNews, getNews, getNewsById, updateNews, deleteNews, initializeNewsTable };