const express = require('express');
const multer = require('multer');
const path = require('path');
const { createResultHallticket, getResultHalltickets, getResultHallticketById, deleteResultHallticket, updateResultHallticket } = require('../controllers/ResultHallticketController');

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
  { name: 'icon', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), createResultHallticket);

router.get('/', getResultHalltickets);
router.get('/:id', getResultHallticketById);
router.delete('/:id', deleteResultHallticket);
router.put('/:id', updateResultHallticket);

module.exports = router;