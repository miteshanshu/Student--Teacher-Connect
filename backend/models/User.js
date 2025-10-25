const mongoose = require('mongoose');

// User model - stores teacher and student information
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true  // Ensure no duplicate emails
  },
  role: {
    type: String,
    enum: ['teacher', 'student'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);