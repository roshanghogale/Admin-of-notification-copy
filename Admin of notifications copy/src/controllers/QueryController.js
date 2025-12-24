const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'OneRoadMap',
  password: process.env.DB_PASSWORD || 'roshan',
  port: process.env.DB_PORT || 5432,
});

const createQuery = async (req, res) => {
  try {
    const {
      userId, name, education, type, title, uploadTime, userRs,
      replyText, replyTimestamp, replyUserRs, likedByUsers
    } = req.body;
    
    if (!userId || !title) {
      return res.status(400).json({ error: 'UserId and title are required' });
    }

    const likedBy = likedByUsers ? JSON.stringify(likedByUsers) : '[]';
    const uploadTimeValue = uploadTime ? new Date(uploadTime) : new Date();
    const replyTimestampValue = replyTimestamp ? new Date(replyTimestamp) : (replyText ? new Date() : null);

    const result = await pool.query(`
      INSERT INTO queries (
        user_id, name, education, type, title, upload_time, user_rs,
        reply_text, reply_timestamp, reply_user_rs, liked_by_users, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW()) 
      ON CONFLICT (user_id) DO UPDATE SET
        name = COALESCE(EXCLUDED.name, queries.name),
        education = COALESCE(EXCLUDED.education, queries.education),
        type = COALESCE(EXCLUDED.type, queries.type),
        title = COALESCE(EXCLUDED.title, queries.title),
        upload_time = COALESCE(EXCLUDED.upload_time, queries.upload_time),
        user_rs = COALESCE(EXCLUDED.user_rs, queries.user_rs),
        reply_text = COALESCE(EXCLUDED.reply_text, queries.reply_text),
        reply_timestamp = COALESCE(EXCLUDED.reply_timestamp, queries.reply_timestamp),
        reply_user_rs = COALESCE(EXCLUDED.reply_user_rs, queries.reply_user_rs),
        liked_by_users = COALESCE(EXCLUDED.liked_by_users, queries.liked_by_users),
        updated_at = NOW()
      RETURNING *
    `, [
      userId,
      name || null,
      education || null,
      type || null,
      title.trim(),
      uploadTimeValue,
      userRs || null,
      replyText || null,
      replyTimestampValue,
      replyUserRs || null,
      likedBy
    ]);

    res.status(201).json({ 
      message: 'Query saved successfully', 
      query: result.rows[0] 
    });
  } catch (error) {
    console.error('Error saving query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getQueries = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM queries ORDER BY upload_time DESC'
    );
    
    res.status(200).json({ queries: result.rows });
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserQueries = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM queries WHERE user_id = $1 ORDER BY upload_time DESC',
      [userId]
    );
    
    res.status(200).json({ queries: result.rows });
  } catch (error) {
    console.error('Error fetching user queries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getQueryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('SELECT * FROM queries WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Query not found' });
    }
    
    res.status(200).json({ query: result.rows[0] });
  } catch (error) {
    console.error('Error fetching query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, education, type, title, uploadTime, userRs,
      replyText, replyTimestamp, replyUserRs, likedByUsers 
    } = req.body;
    
    let updateFields = [];
    let values = [];
    let paramCount = 1;
    
    if (name !== undefined) {
      updateFields.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    
    if (education !== undefined) {
      updateFields.push(`education = $${paramCount}`);
      values.push(education);
      paramCount++;
    }
    
    if (type !== undefined) {
      updateFields.push(`type = $${paramCount}`);
      values.push(type);
      paramCount++;
    }
    
    if (title !== undefined) {
      updateFields.push(`title = $${paramCount}`);
      values.push(title.trim());
      paramCount++;
    }
    
    if (uploadTime !== undefined) {
      updateFields.push(`upload_time = $${paramCount}`);
      values.push(new Date(uploadTime));
      paramCount++;
    }
    
    if (userRs !== undefined) {
      updateFields.push(`user_rs = $${paramCount}`);
      values.push(userRs);
      paramCount++;
    }
    
    if (replyText !== undefined) {
      updateFields.push(`reply_text = $${paramCount}`);
      values.push(replyText);
      paramCount++;
    }
    
    if (replyTimestamp !== undefined) {
      updateFields.push(`reply_timestamp = $${paramCount}`);
      values.push(new Date(replyTimestamp));
      paramCount++;
    }
    
    if (replyUserRs !== undefined) {
      updateFields.push(`reply_user_rs = $${paramCount}`);
      values.push(replyUserRs);
      paramCount++;
    }
    
    if (likedByUsers !== undefined) {
      updateFields.push(`liked_by_users = $${paramCount}`);
      values.push(JSON.stringify(likedByUsers));
      paramCount++;
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    
    const result = await pool.query(`
      UPDATE queries SET ${updateFields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Query not found' });
    }
    
    res.status(200).json({ 
      message: 'Query updated successfully', 
      query: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM queries WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Query not found' });
    }
    
    res.status(200).json({ message: 'Query deleted successfully' });
  } catch (error) {
    console.error('Error deleting query:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const initializeQueriesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS queries (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(100),
        education VARCHAR(100),
        type VARCHAR(100),
        title TEXT NOT NULL,
        upload_time TIMESTAMP DEFAULT NOW(),
        user_rs VARCHAR(255),
        reply_text TEXT,
        reply_timestamp TIMESTAMP,
        reply_user_rs VARCHAR(255),
        liked_by_users JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Add missing columns and constraints if they don't exist
    const migrations = [
      'ALTER TABLE queries ADD COLUMN IF NOT EXISTS user_rs VARCHAR(255)',
      'ALTER TABLE queries ADD COLUMN IF NOT EXISTS reply_user_rs VARCHAR(255)',
      'ALTER TABLE queries ADD CONSTRAINT queries_user_id_unique UNIQUE (user_id)'
    ];
    
    for (const migration of migrations) {
      try {
        await pool.query(migration);
      } catch (err) {
        // Ignore errors for existing columns or constraints
      }
    }
    
    console.log('Queries table initialized');
  } catch (error) {
    console.error('Error initializing queries table:', error);
  }
};

module.exports = { 
  createQuery, 
  getQueries, 
  getUserQueries, 
  getQueryById, 
  updateQuery, 
  deleteQuery, 
  initializeQueriesTable 
};