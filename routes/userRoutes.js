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
router.post('/users', createUser);
router.get('/getAllUsers', getAllUsers);
router.get('/users/:id', getUserById);
router.get('/users/email/:email', getUserByEmail);
router.put('/users/email/:email', updateUser);
router.delete('/users/email/:email', deleteUser);

// New route for fetching all users
module.exports = router;