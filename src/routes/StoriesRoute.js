const express = require('express');
const multer = require('multer');
const path = require('path');
const { createStory, getStories, getStoryById, updateStory, deleteStory } = require('../controllers/StoriesController');

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
    fileSize: 50 * 1024 * 1024 // 50MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

router.post('/', upload.fields([
  { name: 'icon', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), createStory);

router.get('/', getStories);
router.get('/:id', getStoryById);
router.put('/:id', (req, res, next) => {
  const contentType = req.get('Content-Type');
  if (contentType && contentType.includes('multipart/form-data')) {
    upload.fields([
      { name: 'icon', maxCount: 1 },
      { name: 'banner', maxCount: 1 },
      { name: 'video', maxCount: 1 }
    ])(req, res, next);
  } else {
    next();
  }
}, updateStory);
router.delete('/:id', deleteStory);

module.exports = router;