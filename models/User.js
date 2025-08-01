const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Note: In a real app, you might add pre-save hooks for hashing passwords here,
// but for consistency with your current setup, we'll keep hashing in the route handlers.

const User = mongoose.model('User', userSchema);

module.exports = User;