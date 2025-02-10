const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    nickname: { type: String, required: false }, // Optional field
    dob: { type: Date, required: true } // Date of Birth
});

module.exports = mongoose.model('User', userSchema);