const express = require('express');
const multer = require('multer');
const path = require('path');
const { createJobUpdate, getJobUpdates, getJobUpdateById, getBankingJobs, getGovernmentJobs, getPrivateJobs, deleteJobUpdate, deleteAllJobUpdates, updateJobUpdate } = require('../controllers/JobUpdateController');

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
    } else if (file.fieldname.includes('pdf') || file.fieldname.includes('Pdf')) {
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
router.post('/', upload.fields([
  { name: 'icon', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
  { name: 'selectionPdf', maxCount: 1 },
  { name: 'syllabusPdf', maxCount: 1 }
]), createJobUpdate);

router.get('/', getJobUpdates);
router.get('/banking', getBankingJobs);
router.get('/government', getGovernmentJobs);
router.get('/private', getPrivateJobs);
router.get('/:id', getJobUpdateById);
router.put('/:id', updateJobUpdate);
router.delete('/:id', deleteJobUpdate);
router.delete('/', deleteAllJobUpdates);

module.exports = router;