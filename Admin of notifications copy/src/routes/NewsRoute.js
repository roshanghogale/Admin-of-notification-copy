const express = require('express');
const multer = require('multer');
const path = require('path');
const { createNews, getNews, getNewsById, updateNews, deleteNews } = require('../controllers/NewsController');

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
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.post('/', upload.fields([
  { name: 'image', maxCount: 1 }
]), createNews);

router.get('/', getNews);
router.get('/:id', getNewsById);
router.put('/:id', (req, res, next) => {
  const contentType = req.get('Content-Type');
  if (contentType && contentType.includes('multipart/form-data')) {
    upload.fields([
      { name: 'image', maxCount: 1 }
    ])(req, res, next);
  } else {
    next();
  }
}, updateNews);
router.delete('/:id', deleteNews);

module.exports = router;