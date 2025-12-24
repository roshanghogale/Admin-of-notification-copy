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
    let pdfUrl = null;

    // Handle file uploads and generate full URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files) {
      if (req.files.image) {
        imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.pdf) {
        pdfUrl = `${baseUrl}/uploads/${req.files.pdf[0].filename}`;
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
    
    console.log('=== CAREER ROADMAP SAVED TO DATABASE ===');
    console.log('ID:', careerRoadmap.id);
    console.log('Notification flag:', notification);
    
    // Send notification if requested
    if (notification === 'true' || notification === true) {
      console.log('=== CREATING NOTIFICATION PAYLOAD ===');
      
      try {
        const notificationData = {
          type: 'career_roadmap',
          id: careerRoadmap.id.toString(),
          title: careerRoadmap.title,
          roadmap_type: careerRoadmap.type || '',
          education_categories: careerRoadmap.education_categories,
          bachelor_degrees: careerRoadmap.bachelor_degrees,
          masters_degrees: careerRoadmap.masters_degrees,
          image_url: careerRoadmap.image_url || '',
          pdf_url: careerRoadmap.pdf_url || '',
          created_at: careerRoadmap.created_at
        };
        
        console.log('=== NOTIFICATION DATA CREATED ===');
        console.log(JSON.stringify(notificationData, null, 2));
        
        console.log('=== SENDING NOTIFICATION ===');
        const NotificationService = require('../service/NotificationService');
        await NotificationService.sendNotificationToTopic(
          'all',
          null,
          null,
          null,
          null,
          notificationData
        );
        console.log('=== NOTIFICATION SENT SUCCESSFULLY ===');
      } catch (notificationError) {
        console.error('=== NOTIFICATION FAILED ===');
        console.error('Error:', notificationError);
      }
    } else {
      console.log('=== NO NOTIFICATION REQUESTED ===');
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