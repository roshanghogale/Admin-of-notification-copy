const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'OneRoadMap',
  password: process.env.DB_PASSWORD || 'roshan',
  port: process.env.DB_PORT || 5432,
});

const createCurrentAffair = async (req, res) => {
  console.log('=== CREATE CURRENT AFFAIR CALLED ===');
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title required' });
    }

    console.log('About to insert:', title);
    
    const result = await pool.query(
      'INSERT INTO current_affairs (title, created_at) VALUES ($1, NOW()) RETURNING *',
      [title]
    );

    console.log('Insert successful:', result.rows[0]);
    
    res.status(201).json({ 
      message: 'Success', 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error('ERROR:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const getCurrentAffairs = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM current_affairs ORDER BY created_at DESC'
    );
    
    res.status(200).json({ currentAffairs: result.rows });
  } catch (error) {
    console.error('Error fetching current affairs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCurrentAffair = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM current_affairs WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Current affairs not found' });
    }
    
    const currentAffair = result.rows[0];
    
    await pool.query('DELETE FROM current_affairs WHERE id = $1', [id]);
    
    // Delete associated files
    const fileFields = ['image_url', 'pdf_url'];
    fileFields.forEach(field => {
      if (currentAffair[field]) {
        const filePath = path.join(__dirname, '../../', currentAffair[field].replace(`${req.protocol}://${req.get('host')}`, ''));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });
    
    res.status(200).json({ message: 'Current affairs deleted successfully' });
  } catch (error) {
    console.error('Error deleting current affairs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateCurrentAffair = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('=== UPDATING CURRENT AFFAIRS ===');
    console.log('ID:', id);
    console.log('Data:', updateData);
    console.log('Available fields:', Object.keys(updateData));
    
    // Build dynamic update query based on available fields
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    if (updateData.title !== undefined) {
      fields.push(`title = $${paramCount}`);
      values.push(updateData.title);
      paramCount++;
    }
    
    if (updateData.date !== undefined) {
      fields.push(`date = $${paramCount}`);
      values.push(updateData.date ? new Date(updateData.date) : null);
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
    
    values.push(id); // Add ID as last parameter
    
    const result = await pool.query(`
      UPDATE current_affairs SET 
        ${fields.join(', ')}
      WHERE id = $${paramCount} RETURNING *
    `, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Current affairs not found' });
    }
    
    res.status(200).json({ 
      message: 'Current affairs updated successfully', 
      currentAffair: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating current affairs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const initializeCurrentAffairsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS current_affairs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    console.log('Current affairs table created');
  } catch (error) {
    console.error('Table creation error:', error);
  }
};

module.exports = { createCurrentAffair, getCurrentAffairs, deleteCurrentAffair, updateCurrentAffair, initializeCurrentAffairsTable };