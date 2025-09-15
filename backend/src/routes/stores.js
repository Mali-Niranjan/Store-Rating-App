const express = require('express');
const router = express.Router();
const { addStore, listStores, ownerStoreDetails } = require('../controllers/storeController');
const { authenticate, authorize } = require('../middlewares/auth');

// admin add store
router.post('/', authenticate, authorize('admin'), addStore);

// list stores (open to authenticated as well as unauthenticated optional)
router.get('/', authenticate, listStores);

// store owner dashboard
router.get('/owner/dashboard', authenticate, authorize('owner'), ownerStoreDetails);

module.exports = router;
