const express = require('express');
const multer = require('multer');
const path = require('path');
const { createStudyMaterial, getStudyMaterials, getStudyMaterialById, updateStudyMaterial, deleteStudyMaterial } = require('../controllers/StudyMaterialsController');

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
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for PDFs and images
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else if (file.fieldname === 'pdf' && file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), createStudyMaterial);

router.get('/', getStudyMaterials);
router.get('/:id', getStudyMaterialById);
router.put('/:id', (req, res, next) => {
  const contentType = req.get('Content-Type');
  if (contentType && contentType.includes('multipart/form-data')) {
    upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'pdf', maxCount: 1 }
    ])(req, res, next);
  } else {
    next();
  }
}, updateStudyMaterial);
router.delete('/:id', deleteStudyMaterial);

module.exports = router;