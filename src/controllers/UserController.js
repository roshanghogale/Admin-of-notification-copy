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

const createUser = async (req, res) => {
  try {
    const {
      userId, name, gender, avatar, studyGovernment, studyPoliceDefence,
      studyBanking, studySelfImprovement, degree, postGraduation,
      district, taluka, currentAffairs, jobs, ageGroup, education, twelfth
    } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await pool.query(`
      INSERT INTO users (
        user_id, name, gender, avatar, study_government, study_police_defence,
        study_banking, study_self_improvement, degree, post_graduation,
        district, taluka, current_affairs, jobs, age_group, education, twelfth, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW()) 
      ON CONFLICT (user_id) DO UPDATE SET
        name = EXCLUDED.name,
        gender = EXCLUDED.gender,
        avatar = EXCLUDED.avatar,
        study_government = EXCLUDED.study_government,
        study_police_defence = EXCLUDED.study_police_defence,
        study_banking = EXCLUDED.study_banking,
        study_self_improvement = EXCLUDED.study_self_improvement,
        degree = EXCLUDED.degree,
        post_graduation = EXCLUDED.post_graduation,
        district = EXCLUDED.district,
        taluka = EXCLUDED.taluka,
        current_affairs = EXCLUDED.current_affairs,
        jobs = EXCLUDED.jobs,
        age_group = EXCLUDED.age_group,
        education = EXCLUDED.education,
        twelfth = EXCLUDED.twelfth,
        updated_at = NOW()
      RETURNING *
    `, [
      userId || null,
      name.trim(),
      gender || null,
      avatar || null,
      studyGovernment || false,
      studyPoliceDefence || false,
      studyBanking || false,
      studySelfImprovement || false,
      degree || null,
      postGraduation || null,
      district || null,
      taluka || null,
      currentAffairs || false,
      jobs || false,
      ageGroup || null,
      education || null,
      twelfth || null
    ]);

    res.status(201).json({ 
      message: 'User data saved successfully', 
      user: result.rows[0] 
    });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const initializeTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE,
        name VARCHAR(100) NOT NULL,
        gender VARCHAR(20),
        avatar VARCHAR(255),
        study_government BOOLEAN DEFAULT FALSE,
        study_police_defence BOOLEAN DEFAULT FALSE,
        study_banking BOOLEAN DEFAULT FALSE,
        study_self_improvement BOOLEAN DEFAULT FALSE,
        degree VARCHAR(100),
        post_graduation VARCHAR(100),
        district VARCHAR(100),
        taluka VARCHAR(100),
        current_affairs BOOLEAN DEFAULT FALSE,
        jobs BOOLEAN DEFAULT FALSE,
        age_group VARCHAR(50),
        education VARCHAR(100),
        twelfth VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Add missing columns and remove old ones
    const migrations = [
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(255)',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS study_government BOOLEAN DEFAULT FALSE',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS study_police_defence BOOLEAN DEFAULT FALSE', 
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS study_banking BOOLEAN DEFAULT FALSE',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS study_self_improvement BOOLEAN DEFAULT FALSE',
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS twelfth VARCHAR(100)',
      'ALTER TABLE users ALTER COLUMN current_affairs TYPE BOOLEAN USING current_affairs::BOOLEAN',
      'ALTER TABLE users ALTER COLUMN jobs TYPE BOOLEAN USING jobs::BOOLEAN',
      'ALTER TABLE users DROP COLUMN IF EXISTS upsc',
      'ALTER TABLE users DROP COLUMN IF EXISTS mpsc'
    ];
    
    for (const migration of migrations) {
      try {
        await pool.query(migration);
      } catch (err) {
        // Ignore errors for existing columns or type changes
      }
    }
    
    console.log('Users table initialized');
  } catch (error) {
    console.error('Error initializing table:', error);
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users ORDER BY created_at DESC'
    );
    
    res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserByIdentifier = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE user_id = $1 OR name = $1',
      [identifier]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createUser, getUsers, deleteUser, getUserByIdentifier, initializeTable };