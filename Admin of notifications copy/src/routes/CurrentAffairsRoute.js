const express = require('express');
const multer = require('multer');
const path = require('path');
const { createCurrentAffair, getCurrentAffairs, deleteCurrentAffair, updateCurrentAffair } = require('../controllers/CurrentAffairsController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'icon' || file.fieldname === 'image') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for icon and image'));
      }
    } else if (file.fieldname === 'pdf') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed for PDF uploads'));
      }
    } else {
      cb(null, true);
    }
  }
});

// Routes
// Test endpoint
router.post('/test', (req, res) => {
  console.log('Test endpoint hit');
  console.log('Body:', req.body);
  res.json({ message: 'Test successful', body: req.body });
});

router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), createCurrentAffair);

router.get('/', getCurrentAffairs);
router.put('/:id', updateCurrentAffair);
router.delete('/:id', deleteCurrentAffair);

module.exports = router;