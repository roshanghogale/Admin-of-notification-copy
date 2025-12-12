const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const { parseJsonField } = require('../util/jsonHelper');
const { fixSequence } = require('../util/database');

// HTML decode function
const decodeHtml = (html) => {
  if (!html) return html;
  return html
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
};

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'OneRoadMap',
  password: process.env.DB_PASSWORD || 'roshan',
  port: process.env.DB_PORT || 5432,
});

const createJobUpdate = async (req, res) => {
  console.log('=== JOB UPDATE REQUEST RECEIVED ===');
  console.log('Request body:', req.body);
  console.log('Files received:', req.files ? Object.keys(req.files) : 'No files');
  
  try {
    const {
      title,
      salary,
      lastDate,
      postName,
      educationCategories,
      bachelorDegrees,
      mastersDegrees,
      ageRequirement,
      jobPlace,
      applicationFees,
      applicationLink,
      type,
      subType,
      educationRequirement,
      totalPosts,
      note
    } = req.body;

    console.log('Education Requirement received:', educationRequirement);
    console.log('Education Requirement type:', typeof educationRequirement);

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    let iconUrl = null;
    let imageUrl = null;
    let pdfUrl = null;
    let selectionPdfUrl = null;
    let syllabusPdfUrl = null;

    // Handle file uploads and generate full URLs
    const baseUrl = req.get('host').includes('gangainstitute.in') ? 'https://test.gangainstitute.in' : `${req.protocol}://${req.get('host')}`;
    
    if (req.files) {
      if (req.files.icon) {
        iconUrl = `${baseUrl}/uploads/${req.files.icon[0].filename}`;
      }
      if (req.files.image) {
        imageUrl = `${baseUrl}/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.pdf) {
        pdfUrl = `${baseUrl}/uploads/${req.files.pdf[0].filename}`;
      }
      if (req.files.selectionPdf) {
        selectionPdfUrl = `${baseUrl}/uploads/${req.files.selectionPdf[0].filename}`;
      }
      if (req.files.syllabusPdf) {
        syllabusPdfUrl = `${baseUrl}/uploads/${req.files.syllabusPdf[0].filename}`;
      }
    }
    
    console.log('Generated URLs:', { iconUrl, imageUrl, pdfUrl, selectionPdfUrl, syllabusPdfUrl });

    // Fix sequence before insert
    await fixSequence(pool, 'job_updates');
    
    const result = await pool.query(`
      INSERT INTO job_updates (
        title, salary, last_date, post_name, education_categories, 
        bachelor_degrees, masters_degrees, age_requirement, job_place,
        application_fees, application_link, type, sub_type, education_requirement,
        total_posts, note, icon_url, image_url, pdf_url, selection_pdf_url, 
        syllabus_pdf_url, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW()) 
      RETURNING *
    `, [
      title.trim(),
      salary?.trim() || '',
      lastDate ? new Date(lastDate + 'T00:00:00.000Z') : null,
      postName?.trim() || '',
      JSON.stringify(parseJsonField(educationCategories) || []),
      JSON.stringify(parseJsonField(bachelorDegrees) || []),
      JSON.stringify(parseJsonField(mastersDegrees) || []),
      ageRequirement?.trim() || '',
      jobPlace?.trim() || '',
      applicationFees?.trim() || '',
      applicationLink?.trim() || '',
      type?.trim() || '',
      subType?.trim() || '',
      decodeHtml(educationRequirement?.trim()) || '',
      totalPosts?.trim() || '',
      note?.trim() || '',
      iconUrl,
      imageUrl,
      pdfUrl,
      selectionPdfUrl,
      syllabusPdfUrl
    ]);

    const jobUpdate = result.rows[0];
    
    console.log('=== JOB UPDATE SAVED TO DATABASE ===');
    console.log('Job ID:', jobUpdate.id);
    console.log('Notification flag:', req.body.notification);
    
    // Send notification if requested
    if (req.body.notification === 'true' || req.body.notification === true) {
      console.log('=== CREATING NOTIFICATION PAYLOAD ===');
      
      try {
        const notificationData = {
          type: 'job_update',
          id: jobUpdate.id.toString(),
          title: title.trim(),
          salary: salary?.trim() || '',
          last_date: lastDate || null,
          post_name: postName?.trim() || '',
          education_categories: JSON.stringify(educationCategories || []),
          bachelor_degrees: JSON.stringify(bachelorDegrees || []),
          masters_degrees: JSON.stringify(mastersDegrees || []),
          age_requirement: ageRequirement?.trim() || '',
          job_place: jobPlace?.trim() || '',
          application_fees: applicationFees?.trim() || '',
          application_link: applicationLink?.trim() || '',
          job_type: type?.trim() || '',
          sub_type: subType?.trim() || '',
          education_requirement: decodeHtml(educationRequirement?.trim()) || '',
          total_posts: totalPosts?.trim() || '',
          note: note?.trim() || '',
          icon_url: iconUrl || '',
          image_url: imageUrl || '',
          pdf_url: pdfUrl || '',
          selection_pdf_url: selectionPdfUrl || '',
          syllabus_pdf_url: syllabusPdfUrl || ''
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
      message: 'Job update created successfully', 
      jobUpdate: jobUpdate 
    });
  } catch (error) {
    console.error('Error creating job update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getJobUpdates = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM job_updates ORDER BY created_at DESC'
    );
    
    const formattedRows = result.rows.map(row => ({
      ...row,
      last_date: row.last_date ? row.last_date.toLocaleDateString('en-CA') : null,
      created_at: row.created_at ? new Date(row.created_at).toLocaleString('en-IN') : null
    }));
    
    res.status(200).json({ jobUpdates: formattedRows });
  } catch (error) {
    console.error('Error fetching job updates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getJobUpdateById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM job_updates WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job update not found' });
    }
    
    const jobUpdate = {
      ...result.rows[0],
      last_date: result.rows[0].last_date ? result.rows[0].last_date.toLocaleDateString('en-CA') : null,
      created_at: result.rows[0].created_at ? new Date(result.rows[0].created_at).toLocaleString('en-IN') : null
    };
    
    res.status(200).json({ jobUpdate });
  } catch (error) {
    console.error('Error fetching job update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBankingJobs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM job_updates WHERE LOWER(type) = 'banking' ORDER BY created_at DESC"
    );
    
    const formattedRows = result.rows.map(row => ({
      ...row,
      last_date: row.last_date ? row.last_date.toLocaleDateString('en-CA') : null,
      created_at: row.created_at ? new Date(row.created_at).toLocaleString('en-IN') : null
    }));
    
    res.status(200).json({ jobUpdates: formattedRows });
  } catch (error) {
    console.error('Error fetching banking jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getGovernmentJobs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM job_updates WHERE LOWER(type) = 'government' ORDER BY created_at DESC"
    );
    
    const formattedRows = result.rows.map(row => ({
      ...row,
      last_date: row.last_date ? row.last_date.toLocaleDateString('en-CA') : null,
      created_at: row.created_at ? new Date(row.created_at).toLocaleString('en-IN') : null
    }));
    
    res.status(200).json({ jobUpdates: formattedRows });
  } catch (error) {
    console.error('Error fetching government jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPrivateJobs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM job_updates WHERE LOWER(type) = 'private' ORDER BY created_at DESC"
    );
    
    const formattedRows = result.rows.map(row => ({
      ...row,
      last_date: row.last_date ? row.last_date.toLocaleDateString('en-CA') : null,
      created_at: row.created_at ? new Date(row.created_at).toLocaleString('en-IN') : null
    }));
    
    res.status(200).json({ jobUpdates: formattedRows });
  } catch (error) {
    console.error('Error fetching private jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteAllJobUpdates = async (req, res) => {
  try {
    await pool.query('DROP TABLE IF EXISTS job_updates');
    await initializeJobUpdateTable();
    
    res.status(200).json({ message: 'All job updates deleted successfully' });
  } catch (error) {
    console.error('Error deleting all job updates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteJobUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get job update data to find files
    const jobResult = await pool.query('SELECT * FROM job_updates WHERE id = $1', [id]);
    
    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job update not found' });
    }
    
    const jobUpdate = jobResult.rows[0];
    
    // Delete job update from database
    await pool.query('DELETE FROM job_updates WHERE id = $1', [id]);
    
    // Delete associated files
    const fileFields = ['icon_url', 'image_url', 'pdf_url', 'selection_pdf_url', 'syllabus_pdf_url'];
    fileFields.forEach(field => {
      if (jobUpdate[field]) {
        const filePath = path.join(__dirname, '../../', jobUpdate[field]);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });
    
    res.status(200).json({ message: 'Job update deleted successfully' });
  } catch (error) {
    console.error('Error deleting job update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const initializeJobUpdateTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_updates (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        salary VARCHAR(255),
        last_date DATE,
        post_name VARCHAR(255),
        education_categories JSONB,
        bachelor_degrees JSONB,
        masters_degrees JSONB,
        age_requirement VARCHAR(255),
        job_place VARCHAR(255),
        application_fees VARCHAR(255),
        application_link TEXT,
        type VARCHAR(100),
        sub_type VARCHAR(100),
        education_requirement TEXT,
        total_posts VARCHAR(100),
        note TEXT,
        icon_url VARCHAR(255),
        image_url VARCHAR(255),
        pdf_url VARCHAR(255),
        selection_pdf_url VARCHAR(255),
        syllabus_pdf_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Fix sequence issue by setting it to the correct next value
    await pool.query(`
      SELECT setval('job_updates_id_seq', COALESCE((SELECT MAX(id) FROM job_updates), 0) + 1, false)
    `);
    
    console.log('Job updates table initialized and sequence fixed');
  } catch (error) {
    console.error('Error initializing job updates table:', error);
  }
};

const updateJobUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('=== UPDATING JOB UPDATE ===');
    console.log('ID:', id);
    console.log('Data:', updateData);
    
    const result = await pool.query(`
      UPDATE job_updates SET 
        title = $1, salary = $2, last_date = $3, post_name = $4, 
        education_categories = $5, bachelor_degrees = $6, masters_degrees = $7,
        age_requirement = $8, job_place = $9, application_fees = $10,
        application_link = $11, type = $12, sub_type = $13, 
        education_requirement = $14, total_posts = $15, note = $16
      WHERE id = $17 RETURNING *
    `, [
      updateData.title, updateData.salary, updateData.last_date, updateData.post_name,
      JSON.stringify(updateData.education_categories), JSON.stringify(updateData.bachelor_degrees), 
      JSON.stringify(updateData.masters_degrees), updateData.age_requirement, updateData.job_place,
      updateData.application_fees, updateData.application_link, updateData.type, updateData.sub_type,
      decodeHtml(updateData.education_requirement), updateData.total_posts, updateData.note, id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job update not found' });
    }
    
    res.status(200).json({ 
      message: 'Job update updated successfully', 
      jobUpdate: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating job update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createJobUpdate, getJobUpdates, getJobUpdateById, getBankingJobs, getGovernmentJobs, getPrivateJobs, deleteJobUpdate, deleteAllJobUpdates, updateJobUpdate, initializeJobUpdateTable };