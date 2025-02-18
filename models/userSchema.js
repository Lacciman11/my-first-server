const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{ 
        type: String, 
       required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    nickname: { 
        type: String, 
        required: false 
    }, 
    dob: { 
        type: Date, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    } 
});

module.exports = mongoose.model('User', userSchema);