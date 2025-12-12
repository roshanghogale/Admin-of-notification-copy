const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'OneRoadMap',
  password: process.env.DB_PASSWORD || 'roshan',
  port: process.env.DB_PORT || 5432,
});

const createNotificationBanner = async (req, res) => {
  try {
    const { notificationType, contentId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Banner image is required' });
    }

    const bannerUrl = `/uploads/notification-banners/${req.file.filename}`;

    const result = await pool.query(`
      INSERT INTO notification_banners (
        notification_type, content_id, banner_url, created_at
      ) VALUES ($1, $2, $3, NOW()) 
      RETURNING *
    `, [
      notificationType,
      contentId || null,
      bannerUrl
    ]);

    res.status(201).json({ 
      message: 'Banner uploaded successfully', 
      banner: result.rows[0] 
    });
  } catch (error) {
    console.error('Error uploading banner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBanners = async (req, res) => {
  try {
    const { type } = req.query;
    
    let query = 'SELECT * FROM notification_banners ORDER BY created_at DESC';
    let values = [];
    
    if (type) {
      query = 'SELECT * FROM notification_banners WHERE notification_type = $1 ORDER BY created_at DESC';
      values = [type];
    }
    
    const result = await pool.query(query, values);
    res.status(200).json({ banners: result.rows });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM notification_banners WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const initializeNotificationBannersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notification_banners (
        id SERIAL PRIMARY KEY,
        notification_type VARCHAR(100) NOT NULL,
        content_id VARCHAR(255),
        banner_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    console.log('Notification banners table initialized');
  } catch (error) {
    console.error('Error initializing notification banners table:', error);
  }
};

module.exports = { 
  createNotificationBanner, 
  getBanners, 
  deleteBanner, 
  initializeNotificationBannersTable 
};