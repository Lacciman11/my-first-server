const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config');
const User = require('./schema');
const validateUser = require('./middleWare');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies
app.use(morgan('combined')); // Log HTTP requests

// Security Middleware (Helmet with enhanced protection)
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust script sources if needed
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:"],
                connectSrc: ["'self'"]
            }
        }
    })
);
app.use(helmet.xssFilter()); // Prevent cross-site scripting (XSS)
app.use(helmet.frameguard({ action: "deny" })); // Prevent clickjacking
app.use(helmet.noSniff()); // Prevent MIME sniffing
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true })); // Enforce HTTPS
app.use(cors({
    origin: '*', // Allows all origins (Change this to specific domains if needed)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle preflight requests
app.options('*', cors());

// ✅ Manually Set Headers for Extra Safety
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allows all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME sniffing
    res.setHeader('X-Frame-Options', 'DENY'); // Prevent Clickjacking
    res.setHeader('Referrer-Policy', 'no-referrer'); // Hide referrer info
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()'); // Restrict browser APIs
    next();
});

// CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

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