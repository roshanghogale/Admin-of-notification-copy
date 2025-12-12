const express = require('express');
const { createQuery, getQueries, getQueryById, updateQuery, deleteQuery, getUserQueries } = require('../controllers/QueryController');

const router = express.Router();

router.post('/', createQuery);
router.get('/', getQueries);
router.get('/user/:userId', getUserQueries);
router.get('/:id', getQueryById);
router.put('/:id', updateQuery);
router.delete('/:id', deleteQuery);

module.exports = router;