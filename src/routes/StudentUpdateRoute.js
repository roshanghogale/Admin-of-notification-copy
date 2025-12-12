const express = require('express');
const multer = require('multer');
const path = require('path');
const { createStudentUpdate, getStudentUpdates, getStudentUpdateById, deleteStudentUpdate, updateStudentUpdate } = require('../controllers/StudentUpdateController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'notificationPdf', maxCount: 1 },
  { name: 'selectionPdf', maxCount: 1 }
]), createStudentUpdate);

router.get('/', getStudentUpdates);
router.get('/:id', getStudentUpdateById);
router.delete('/:id', deleteStudentUpdate);
router.put('/:id', updateStudentUpdate);

module.exports = router;