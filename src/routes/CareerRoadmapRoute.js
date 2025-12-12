const express = require('express');
const multer = require('multer');
const path = require('path');
const { createCareerRoadmap, getCareerRoadmaps, deleteCareerRoadmap, updateCareerRoadmap } = require('../controllers/CareerRoadmapController');

const router = express.Router();

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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    } else if (file.fieldname === 'pdf') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'));
      }
    } else {
      cb(null, true);
    }
  }
});

router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), createCareerRoadmap);

router.get('/', getCareerRoadmaps);
router.put('/:id', updateCareerRoadmap);
router.delete('/:id', deleteCareerRoadmap);

module.exports = router;