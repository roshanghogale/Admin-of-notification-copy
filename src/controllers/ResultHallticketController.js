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

const createResultHallticket = async (req, res) => {
  try {
    const { 
      title, category, type, examDate, 
      educationCategories, bachelorDegrees, mastersDegrees,
      description1, description2, websiteUrls, notification 
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Parse arrays from JSON strings
    let parsedEducationCategories = [];
    let parsedBachelorDegrees = [];
    let parsedMastersDegrees = [];
    let parsedWebsiteUrls = [];

    parsedEducationCategories = parseJsonField(educationCategories) || [];
    parsedBachelorDegrees = parseJsonField(bachelorDegrees) || [];
    parsedMastersDegrees = parseJsonField(mastersDegrees) || [];
    parsedWebsiteUrls = parseJsonField(websiteUrls) || [];

    let iconUrl = null;
    let imageUrl = null;

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files) {
      if (req.files.icon) {
        iconUrl = `${baseUrl}/uploads/${req.files.icon[0].filename}`;
      }
      if (req.files.image) {
        imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
      }
    }

    const educationRequirement = (parsedEducationCategories.length > 0 && (parsedEducationCategories.includes('10th') || parsedEducationCategories.includes('12th') || parsedEducationCategories.includes('All')))
      ? parsedEducationCategories[0] || ''
      : {
          categories: parsedEducationCategories,
          bachelors: parsedBachelorDegrees,
          masters: parsedMastersDegrees
        };

    // Handle exam date - only parse if it's a valid date string
    let parsedExamDate = null;
    if (examDate && examDate.trim() && examDate !== 'null' && examDate !== 'undefined') {
      const dateObj = new Date(examDate);
      if (!isNaN(dateObj.getTime())) {
        parsedExamDate = dateObj;
      }
    }

    // Fix sequence before insert
    await fixSequence(pool, 'result_hallticket_updates');
    
    const result = await pool.query(`
      INSERT INTO result_hallticket_updates (
        title, category, type, exam_date, education_requirement,
        website_urls, description, icon_url, image_url, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) 
      RETURNING *
    `, [
      title.trim(),
      category?.trim() || '',
      type?.trim() || '',
      parsedExamDate,
      JSON.stringify(educationRequirement),
      JSON.stringify(parsedWebsiteUrls),
      JSON.stringify({
        paragraph1: description1 || '',
        paragraph2: description2 || ''
      }),
      iconUrl,
      imageUrl
    ]);

    const resultHallticket = result.rows[0];
    
    if (notification === 'true' || notification === true) {
      try {
        const notificationData = {
          type: 'result_hallticket_update',
          id: resultHallticket.id.toString(),
          title: resultHallticket.title,
          category: resultHallticket.category || '',
          update_type: resultHallticket.type || '',
          exam_date: resultHallticket.exam_date || null,
          education_requirement: resultHallticket.education_requirement,
          website_urls: resultHallticket.website_urls,
          description: resultHallticket.description,
          icon_url: resultHallticket.icon_url || '',
          image_url: resultHallticket.image_url || '',
          created_at: resultHallticket.created_at
        };
        
        const NotificationService = require('../service/NotificationService');
        await NotificationService.sendNotificationToTopic(
          'all',
          null,
          null,
          null,
          null,
          notificationData
        );
      } catch (notificationError) {
        console.error('Notification failed:', notificationError);
      }
    }
    
    res.status(201).json({ 
      message: 'Result/Hall ticket update created successfully', 
      resultHallticket: resultHallticket 
    });
  } catch (error) {
    console.error('Error creating result/hall ticket update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getResultHalltickets = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM result_hallticket_updates ORDER BY created_at DESC'
    );
    
    res.status(200).json({ resultHalltickets: result.rows });
  } catch (error) {
    console.error('Error fetching result/hall ticket updates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getResultHallticketById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM result_hallticket_updates WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Result/Hall ticket update not found' });
    }
    
    res.status(200).json({ resultHallticket: result.rows[0] });
  } catch (error) {
    console.error('Error fetching result/hall ticket update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteResultHallticket = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM result_hallticket_updates WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Result/Hall ticket update not found' });
    }
    
    const resultHallticket = result.rows[0];
    
    const fileFields = ['icon_url', 'image_url'];
    fileFields.forEach(field => {
      if (resultHallticket[field]) {
        try {
          const url = resultHallticket[field];
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
    
    await pool.query('DELETE FROM result_hallticket_updates WHERE id = $1', [id]);
    
    res.status(200).json({ message: 'Result/Hall ticket update deleted successfully' });
  } catch (error) {
    console.error('Error deleting result/hall ticket update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateResultHallticket = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    const fieldMap = {
      title: 'title',
      exam_name: 'exam_name',
      category: 'category',
      type: 'type',
      exam_date: 'exam_date',
      education_requirement: 'education_requirement',
      website_urls: 'website_urls',
      description: 'description',
      icon_url: 'icon_url',
      image_url: 'image_url'
    };

    Object.keys(fieldMap).forEach(key => {
      if (updateData[key] !== undefined) {
        fields.push(`${fieldMap[key]} = $${paramCount}`);
        if (key === 'education_requirement' || key === 'website_urls' || key === 'description') {
          values.push(JSON.stringify(updateData[key]));
        } else if (key === 'exam_date') {
          values.push(updateData[key] ? new Date(updateData[key]) : null);
        } else {
          values.push(updateData[key]);
        }
        paramCount++;
      }
    });
    
    values.push(id);
    
    const result = await pool.query(`
      UPDATE result_hallticket_updates SET 
        ${fields.join(', ')}
      WHERE id = $${paramCount} RETURNING *
    `, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Result/Hall ticket update not found' });
    }
    
    res.status(200).json({ 
      message: 'Result/Hall ticket update updated successfully', 
      resultHallticket: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating result/hall ticket update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const initializeResultHallticketTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS result_hallticket_updates (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        exam_name VARCHAR(255),
        category VARCHAR(100),
        type VARCHAR(50),
        exam_date DATE,
        education_requirement JSONB,
        website_urls JSONB,
        description JSONB,
        icon_url VARCHAR(255),
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    console.log('Result/Hall ticket updates table initialized');
  } catch (error) {
    console.error('Error initializing result/hall ticket updates table:', error);
  }
};

module.exports = { createResultHallticket, getResultHalltickets, getResultHallticketById, deleteResultHallticket, updateResultHallticket, initializeResultHallticketTable };