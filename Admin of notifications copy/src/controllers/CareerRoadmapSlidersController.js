const { pool } = require('../util/database');
const fs = require('fs');
const path = require('path');

const createCareerRoadmapSlidersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS career_roadmap_sliders (
      id SERIAL PRIMARY KEY,
      image_url VARCHAR(500),
      url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  // Remove old columns if they exist
  try {
    await pool.query('ALTER TABLE career_roadmap_sliders DROP COLUMN IF EXISTS video_document_id');
    await pool.query('ALTER TABLE career_roadmap_sliders DROP COLUMN IF EXISTS document_id');
  } catch (error) {
    console.log('Columns already removed or do not exist');
  }
  
  try {
    await pool.query(createTableQuery);
    console.log('career_roadmap_sliders table created successfully');
  } catch (error) {
    console.error('Error creating career_roadmap_sliders table:', error);
  }
};

const getAllCareerRoadmapSliders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM career_roadmap_sliders ORDER BY created_at DESC');
    res.json({ careerRoadmapSliders: result.rows });
  } catch (error) {
    console.error('Error fetching career roadmap sliders:', error);
    res.status(500).json({ error: 'Failed to fetch career roadmap sliders' });
  }
};

const createCareerRoadmapSlider = async (req, res) => {
  try {
    const { url } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const insertQuery = `
      INSERT INTO career_roadmap_sliders (image_url, url)
      VALUES ($1, $2)
      RETURNING *
    `;

    const values = [
      imageUrl,
      url || null
    ];

    const result = await pool.query(insertQuery, values);
    

    
    res.status(201).json({ careerRoadmapSlider: result.rows[0] });
  } catch (error) {
    console.error('Error creating career roadmap slider:', error);
    res.status(500).json({ error: 'Failed to create career roadmap slider' });
  }
};

const updateCareerRoadmapSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { url } = req.body;

    const updateQuery = `
      UPDATE career_roadmap_sliders SET
        url = $1
      WHERE id = $2
      RETURNING *
    `;

    const values = [
      url || null,
      id
    ];

    const result = await pool.query(updateQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Career roadmap slider not found' });
    }

    res.json({ careerRoadmapSlider: result.rows[0] });
  } catch (error) {
    console.error('Error updating career roadmap slider:', error);
    res.status(500).json({ error: 'Failed to update career roadmap slider' });
  }
};

const deleteCareerRoadmapSlider = async (req, res) => {
  try {
    const { id } = req.params;

    const selectQuery = 'SELECT * FROM career_roadmap_sliders WHERE id = $1';
    const selectResult = await pool.query(selectQuery, [id]);

    if (selectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Career roadmap slider not found' });
    }

    const slider = selectResult.rows[0];

    if (slider.image_url) {
      const filePath = path.join(__dirname, '../../uploads', path.basename(slider.image_url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const deleteQuery = 'DELETE FROM career_roadmap_sliders WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    res.json({ message: 'Career roadmap slider deleted successfully' });
  } catch (error) {
    console.error('Error deleting career roadmap slider:', error);
    res.status(500).json({ error: 'Failed to delete career roadmap slider' });
  }
};

module.exports = {
  createCareerRoadmapSlidersTable,
  getAllCareerRoadmapSliders,
  createCareerRoadmapSlider,
  updateCareerRoadmapSlider,
  deleteCareerRoadmapSlider
};