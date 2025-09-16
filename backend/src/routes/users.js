const express = require('express');
const router = express.Router();
const { createUserByAdmin, listUsers, getUser, updatePassword } = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateUserCreationByAdmin } = require('../middlewares/validate');

// admin creates users
router.post('/', authenticate, authorize('admin'), validateUserCreationByAdmin, createUserByAdmin);

// list users
router.get('/', authenticate, authorize('admin'), listUsers);

// view user
router.get('/:id', authenticate, authorize('admin'), getUser);

// update password (logged in)
router.put('/me/password', authenticate, updatePassword);

module.exports = router;
