const express = require('express');
const multer = require('multer');
const path = require('path');
const { createUser, getUsers, deleteUser, getUserByIdentifier } = require('../controllers/UserController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
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

const router = express.Router();

router.post('/register', createUser);
router.post('/save-data', createUser);
router.get('/list', getUsers);
router.get('/:identifier', getUserByIdentifier);
router.delete('/:id', deleteUser);

module.exports = router;