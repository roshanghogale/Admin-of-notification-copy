const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createNotificationBanner, getBanners, deleteBanner } = require('../controllers/NotificationBannerController');

const router = express.Router();

// Create uploads/notification-banners directory if it doesn't exist
const bannerDir = path.join(__dirname, '../../uploads/notification-banners');
if (!fs.existsSync(bannerDir)) {
  fs.mkdirSync(bannerDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, bannerDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

router.post('/', upload.single('banner'), createNotificationBanner);
router.get('/', getBanners);
router.delete('/:id', deleteBanner);

module.exports = router;