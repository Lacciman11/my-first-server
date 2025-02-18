const validateUser = (req, res, next) => {
    const { username, email, address, dob } = req.body;

    if (!username || !email || !address || !dob) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate email format (basic check)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate date format (basic check)
    if (isNaN(new Date(dob).getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
    }

    next(); // Proceed to the next middleware/route handler
};

module.exports = validateUser;