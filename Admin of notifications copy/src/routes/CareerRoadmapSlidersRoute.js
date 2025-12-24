const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllCareerRoadmapSliders,
  createCareerRoadmapSlider,
  updateCareerRoadmapSlider,
  deleteCareerRoadmapSlider
} = require('../controllers/CareerRoadmapSlidersController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'career-slider-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/', getAllCareerRoadmapSliders);
router.post('/', upload.single('image'), createCareerRoadmapSlider);
router.put('/:id', updateCareerRoadmapSlider);
router.delete('/:id', deleteCareerRoadmapSlider);

module.exports = router;