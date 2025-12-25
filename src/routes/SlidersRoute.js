const express = require('express');
const multer = require('multer');
const path = require('path');
const { createSlider, getSliders, getSliderById, getHomeSliders, getBankingSliders, getGovernmentSliders, getPrivateSliders, updateSlider, deleteSlider } = require('../controllers/SlidersController');

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
    fileSize: 50 * 1024 * 1024 // 50MB limit
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
]), createSlider);

router.get('/', getSliders);
router.get('/home', getHomeSliders);
router.get('/banking', getBankingSliders);
router.get('/government', getGovernmentSliders);
router.get('/private', getPrivateSliders);
router.get('/:id', getSliderById);
router.put('/:id', (req, res, next) => {
  const contentType = req.get('Content-Type');
  if (contentType && contentType.includes('multipart/form-data')) {
    upload.fields([
      { name: 'image', maxCount: 1 }
    ])(req, res, next);
  } else {
    next();
  }
}, updateSlider);
router.delete('/:id', deleteSlider);

module.exports = router;