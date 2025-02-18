const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies
// Create a write stream (in append mode) for logging requests
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Setup Morgan to log requests to access.log
app.use(morgan('combined', { stream: accessLogStream }));
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
// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
// Create a new user
app.use(userRoutes);

app.get('/', async (req, res) => {
   res.send('Hello World');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});