const mongoose = require('mongoose');
require('dotenv').config()

const connectString = process.env.MONGO_URI;


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(connectString);
    
        console.log(`MongoDB Connected`);
      } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
    };

module.exports = connectDB;