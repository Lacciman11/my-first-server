const express = require('express');
const router = express.Router();
const {
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    getAllUsers, // Import the new function
} = require('../controllers/userControllers');

// Existing routes
router.post('/', createUser);
router.get('/:id', getUserById);
router.get('/email/:email', getUserByEmail);
router.put('/email/:email', updateUser);
router.delete('/email/:email', deleteUser);

// New route for fetching all users
router.get('/', getAllUsers);

module.exports = router;