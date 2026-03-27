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
    const { title, postDocumentId, webUrl, type, otherType, isMainStory, educationCategories, bachelorDegrees, mastersDegrees, selectedDistrict, selectedTaluka, ageGroups, bhartyTypes, mediaType, notificationDescription } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    let iconUrl = null;
    let bannerUrl = null;
    let videoUrl = null;
    const finalMediaType = mediaType || 'image';

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files) {
      if (req.files.icon) {
        iconUrl = `${baseUrl}/uploads/${req.files.icon[0].filename}`;
      }
      if (req.files.banner) {
        bannerUrl = `${baseUrl}/uploads/${req.files.banner[0].filename}`;
      }
      if (req.files.video) {
        // Video file uploaded, just save URL
        const videoFilename = req.files.video[0].filename;
        videoUrl = `${baseUrl}/uploads/${videoFilename}`;
      }
    }

    const result = await pool.query(`
      INSERT INTO stories (
        title, post_document_id, web_url, type, other_type, is_main_story,
        education_categories, bachelor_degrees, masters_degrees, district, taluka, age_groups, bharty_types,
        icon_url, banner_url, video_url, media_type, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW()) 
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
      JSON.stringify(parseJsonField(selectedDistrict) || []),
      JSON.stringify(parseJsonField(selectedTaluka) || []),
      JSON.stringify(parseJsonField(ageGroups) || []),
      JSON.stringify(parseJsonField(bhartyTypes) || []),
      iconUrl,
      bannerUrl,
      videoUrl,
      finalMediaType
    ]);

    const story = result.rows[0];
    
    if (req.body.notification === 'true' || req.body.notification === true) {
      try {
        const notificationData = {
          type: 'story',
          id: story.id.toString(),
          title: story.title,
          body: notificationDescription?.trim() || story.title,
          description: notificationDescription?.trim() || '',
          post_document_id: story.post_document_id || '',
          web_url: story.web_url || '',
          story_type: story.type || '',
          other_type: story.other_type || '',
          is_main_story: String(story.is_main_story || false),
          education_categories: JSON.stringify(story.education_categories || []),
          bachelor_degrees: JSON.stringify(story.bachelor_degrees || []),
          masters_degrees: JSON.stringify(story.masters_degrees || []),
          district: JSON.stringify(story.district || []),
          taluka: JSON.stringify(story.taluka || []),
          age_groups: JSON.stringify(story.age_groups || []),
          bharty_types: JSON.stringify(story.bharty_types || []),
          icon_url: story.icon_url || '',
          banner_url: story.banner_url || '',
          video_url: story.video_url || '',
          media_type: story.media_type || 'image',
          created_at: story.created_at
        };
        
        let topics = ['all'];
        
        if (story.is_main_story) {
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
          
          const eduCategories = parseJsonField(educationCategories) || [];
          const bachelorDegreesList = parseJsonField(bachelorDegrees) || [];
          const districtList = parseJsonField(selectedDistrict) || [];
          const talukaList = parseJsonField(selectedTaluka) || [];
          const ageGroupsList = parseJsonField(ageGroups) || [];
          
          if (otherType === 'education') {
            if (eduCategories.includes('All')) {
              topics = ['all'];
            } else {
              topics = [];
              const basicEducation = eduCategories.filter(cat => cat === '10th' || cat === '12th');
              topics.push(...basicEducation);
              
              const otherCategories = eduCategories.filter(cat => cat !== '10th' && cat !== '12th');
              if (otherCategories.length > 0) {
                const sanitizedDegrees = bachelorDegreesList.map(sanitizeTopic).filter(t => t);
                topics.push(...sanitizedDegrees);
              }
              
              if (topics.length === 0) topics = ['all'];
            }
          } else if (otherType === 'location') {
            if (districtList.includes('All') || talukaList.includes('All')) {
              topics = ['all'];
            } else {
              topics = talukaList.length > 0 ? talukaList.map(sanitizeTopic).filter(t => t) : ['all'];
            }
          } else if (otherType === 'age group') {
            if (ageGroupsList.includes('All')) {
              topics = ['all'];
            } else {
              topics = ageGroupsList.length > 0 ? ageGroupsList.map(ag => sanitizeTopic(ag.replace(/ and /g, ''))).filter(t => t) : ['all'];
            }
          } else if (otherType === 'bharty types') {
            const bhartyTypesList = parseJsonField(bhartyTypes) || [];
            const bhartyTopicMap = {
              'Government': 'governmentfree',
              'Police & Defence': 'policefree',
              'Banking': 'bankingfree'
            };
            topics = bhartyTypesList.length > 0 
              ? bhartyTypesList.map(type => bhartyTopicMap[type] || 'all').filter(t => t)
              : ['all'];
          }
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
    let videoUrl = req.body.video_url || existingStory.video_url;
    const mediaType = req.body.media_type || existingStory.media_type || 'image';
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    if (req.files) {
      if (req.files.icon) {
        iconUrl = `${baseUrl}/uploads/${req.files.icon[0].filename}`;
      }
      if (req.files.banner) {
        bannerUrl = `${baseUrl}/uploads/${req.files.banner[0].filename}`;
      }
      if (req.files.video) {
        const videoFilePath = req.files.video[0].path;
        // Video is already compressed, just save URL
        videoUrl = `${baseUrl}/uploads/${req.files.video[0].filename}`;
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
        masters_degrees = $9, district = $10, taluka = $11, age_groups = $12, bharty_types = $13, icon_url = $14, 
        banner_url = $15, video_url = $16, media_type = $17, updated_at = NOW()
      WHERE id = $18 RETURNING *
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
      parseJsonField(req.body.district, existingStory.district),
      parseJsonField(req.body.taluka, existingStory.taluka),
      parseJsonField(req.body.age_groups, existingStory.age_groups),
      parseJsonField(req.body.bharty_types, existingStory.bharty_types),
      iconUrl,
      bannerUrl,
      videoUrl,
      mediaType,
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
    
    const fileFields = ['icon_url', 'banner_url', 'video_url'];
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
        district JSONB,
        taluka JSONB,
        age_groups JSONB,
        bharty_types JSONB,
        icon_url VARCHAR(500),
        banner_url VARCHAR(500),
        video_url VARCHAR(500),
        media_type VARCHAR(20) DEFAULT 'image',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Safer migrations - handle existing data
    const migrations = [
      'ALTER TABLE stories ADD COLUMN IF NOT EXISTS age_groups JSONB',
      'ALTER TABLE stories ADD COLUMN IF NOT EXISTS bharty_types JSONB'
    ];
    
    for (const migration of migrations) {
      try {
        await pool.query(migration);
      } catch (err) {
        console.log(`Migration skipped: ${migration}`);
      }
    }
    
    console.log('Stories table initialized and schema updated');
  } catch (error) {
    console.error('Error initializing stories table:', error);
  }
};

module.exports = { createStory, getStories, getStoryById, updateStory, deleteStory, initializeStoriesTable };