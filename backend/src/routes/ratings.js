const express = require('express');
const router = express.Router();
const { submitRating, getStoreRatings } = require('../controllers/ratingController');
const { authenticate, authorize } = require('../middlewares/auth');

// normal users submit rating
router.post('/', authenticate, authorize('normal'), submitRating);

// get ratings for a store (admin/owner)
router.get('/:id', authenticate, getStoreRatings);

module.exports = router;
