const express = require('express');
const router = express.Router();
const validateUser = require('../middlewares/middleWare');

const { 
    createUser, 
    getUserById, 
    getUserByEmail, 
    updateUser, 
    deleteUser } = require('../controllers/userControllers');

router.post('/users', validateUser, createUser);
router.get('/users/:id', getUserById);
router.get('/users/email/:email', getUserByEmail);
router.put('/users/email/:email', updateUser);
router.delete('/users/email/:email', deleteUser);

module.exports = router;