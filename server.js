const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config');
const User = require('./schema');
const validateUser = require('./middleWare');
const cors = require('cors');

const app = express();
const port = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

app.use(cors({
    origin: ['https://localhost:5174', 'http://another-allowed.com'], // Allowed frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed request methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed request headers
}));

app.options('*', cors());
// Routes
// Create a new user
app.post('/users', validateUser, async (req, res) => {
    try {
        const { username, email, address, nickname, dob } = req.body;
        const user = new User({ username, email, address, nickname, dob });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Get a single user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

app.get('/users/email/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

app.put('/users/email/:email', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: req.params.email }, // Find user by email
            { $set: req.body }, // Update fields with request body
            { new: true, runValidators: true } // Return updated user, validate data
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

app.delete('/users/email/:email', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ email: req.params.email });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});