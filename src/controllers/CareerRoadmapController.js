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

const createCareerRoadmap = async (req, res) => {
  console.log('=== CAREER ROADMAP REQUEST RECEIVED ===');
  console.log('Request body:', req.body);
  console.log('Files received:', req.files ? Object.keys(req.files) : 'No files');
  
  try {
    const { title, type, educationCategories, bachelorDegrees, mastersDegrees, notification } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    let imageUrl = null;
    let pdfUrl = req.body.pdfUrl || null;

    // Handle file uploads and generate full URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files) {
      if (req.files.image) {
        imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
      }
    }
    
    console.log('Generated URLs:', { imageUrl, pdfUrl });

    const result = await pool.query(`
      INSERT INTO career_roadmaps (
        title, type, education_categories, bachelor_degrees, masters_degrees, 
        image_url, pdf_url, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
      RETURNING *
    `, [
      title.trim(),
      type || null,
      JSON.stringify(parseJsonField(educationCategories) || []),
      JSON.stringify(parseJsonField(bachelorDegrees) || []),
      JSON.stringify(parseJsonField(mastersDegrees) || []),
      imageUrl,
      pdfUrl
    ]);

    const careerRoadmap = result.rows[0];
    
    // Send notification if requested
    if (notification === 'true' || notification === true) {
      try {
        const notificationData = {
          type: 'career_roadmap',
          id: careerRoadmap.id.toString(),
          title: careerRoadmap.title,
          body: careerRoadmap.title,
          roadmap_type: careerRoadmap.type || '',
          education_categories: JSON.stringify(careerRoadmap.education_categories || []),
          bachelor_degrees: JSON.stringify(careerRoadmap.bachelor_degrees || []),
          masters_degrees: JSON.stringify(careerRoadmap.masters_degrees || []),
          image_url: careerRoadmap.image_url || '',
          pdf_url: careerRoadmap.pdf_url || '',
          created_at: careerRoadmap.created_at
        };
        
        // Determine topics based on type
        const eduCategories = parseJsonField(educationCategories) || [];
        const bachelorDegreesList = parseJsonField(bachelorDegrees) || [];
        let topics = [];
        
        // Sanitize topic name for FCM (match Android app format)
        const sanitizeTopic = (topic) => {
          return topic
            .replace(/\s+/g, '')
            .replace(/\./g, '')
            .replace(/[()]/g, '')
            .replace(/&/g, '')
            .replace(/\//g, '')
            .replace(/-/g, '')
            .replace(/[^a-zA-Z0-9]/g, '')
            .substring(0, 900);
        };
        
        if (type === 'startup') {
          topics = ['all'];
        } else if (eduCategories.includes('All')) {
          topics = ['all'];
        } else {
          // Add 10th and 12th if selected
          const basicEducation = eduCategories.filter(cat => cat === '10th' || cat === '12th');
          topics.push(...basicEducation);
          
          // Add sanitized bachelor degrees for other categories
          const otherCategories = eduCategories.filter(cat => cat !== '10th' && cat !== '12th');
          if (otherCategories.length > 0) {
            const sanitizedDegrees = bachelorDegreesList.map(sanitizeTopic).filter(t => t);
            topics.push(...sanitizedDegrees);
          }
          
          if (topics.length === 0) topics = ['all'];
        }
        
        const NotificationService = require('../service/NotificationService');
        for (const topic of topics) {
          await NotificationService.sendNotificationToTopic(
            topic,
            null,
            null,
            null,
            null,
            notificationData
          );
        }
      } catch (notificationError) {
        console.error('Notification failed:', notificationError);
      }
    }
    
    res.status(201).json({ 
      message: 'Career roadmap created successfully', 
      careerRoadmap: careerRoadmap 
    });
  } catch (error) {
    console.error('Error creating career roadmap:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCareerRoadmaps = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM career_roadmaps ORDER BY created_at DESC'
    );
    
    res.status(200).json({ careerRoadmaps: result.rows });
  } catch (error) {
    console.error('Error fetching career roadmaps:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCareerRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM career_roadmaps WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Career roadmap not found' });
    }
    
    const careerRoadmap = result.rows[0];
    
    // Delete associated files from local storage
    const fileFields = ['image_url', 'pdf_url'];
    fileFields.forEach(field => {
      if (careerRoadmap[field]) {
        try {
          // Extract filename from URL (e.g., http://localhost:3000/uploads/filename.jpg -> filename.jpg)
          const url = careerRoadmap[field];
          const filename = url.split('/uploads/')[1];
          if (filename) {
            const filePath = path.join(__dirname, '../../uploads', filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted file: ${filePath}`);
            }
          }
        } catch (fileError) {
          console.error(`Error deleting file for ${field}:`, fileError);
        }
      }
    });
    
    await pool.query('DELETE FROM career_roadmaps WHERE id = $1', [id]);
    
    res.status(200).json({ message: 'Career roadmap deleted successfully' });
  } catch (error) {
    console.error('Error deleting career roadmap:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateCareerRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('=== UPDATING CAREER ROADMAP ===');
    console.log('ID:', id);
    console.log('Data:', updateData);
    
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    if (updateData.title !== undefined) {
      fields.push(`title = $${paramCount}`);
      values.push(updateData.title);
      paramCount++;
    }
    
    if (updateData.type !== undefined) {
      fields.push(`type = $${paramCount}`);
      values.push(updateData.type);
      paramCount++;
    }
    
    if (updateData.education_categories !== undefined) {
      fields.push(`education_categories = $${paramCount}`);
      values.push(JSON.stringify(updateData.education_categories));
      paramCount++;
    }
    
    if (updateData.bachelor_degrees !== undefined) {
      fields.push(`bachelor_degrees = $${paramCount}`);
      values.push(JSON.stringify(updateData.bachelor_degrees));
      paramCount++;
    }
    
    if (updateData.masters_degrees !== undefined) {
      fields.push(`masters_degrees = $${paramCount}`);
      values.push(JSON.stringify(updateData.masters_degrees));
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
      UPDATE career_roadmaps SET 
        ${fields.join(', ')}
      WHERE id = $${paramCount} RETURNING *
    `, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Career roadmap not found' });
    }
    
    res.status(200).json({ 
      message: 'Career roadmap updated successfully', 
      careerRoadmap: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating career roadmap:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const initializeCareerRoadmapsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS career_roadmaps (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50),
        education_categories JSONB,
        bachelor_degrees JSONB,
        masters_degrees JSONB,
        image_url VARCHAR(255),
        pdf_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    console.log('Career roadmaps table initialized');
  } catch (error) {
    console.error('Error initializing career roadmaps table:', error);
  }
};

module.exports = { createCareerRoadmap, getCareerRoadmaps, deleteCareerRoadmap, updateCareerRoadmap, initializeCareerRoadmapsTable };