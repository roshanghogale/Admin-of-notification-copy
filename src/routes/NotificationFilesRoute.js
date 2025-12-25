const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllNotificationFiles,
  createNotificationFile,
  updateNotificationFile,
  deleteNotificationFile
} = require('../controllers/NotificationFilesController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'notification-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

router.get('/', getAllNotificationFiles);
router.post('/', upload.single('image'), createNotificationFile);
router.put('/:id', updateNotificationFile);
router.delete('/:id', deleteNotificationFile);

module.exports = router;