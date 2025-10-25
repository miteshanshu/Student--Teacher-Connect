const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST - Register new user (teacher or student)
router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !role) {
      console.log('Validation error: Missing fields', { name, email, role });
      return res.status(400).json({ message: 'Name, email, and role are required' });
    }

    // Validate role is either teacher or student
    if (!['teacher', 'student'].includes(role)) {
      console.log('Validation error: Invalid role', role);
      return res.status(400).json({ message: 'Role must be teacher or student' });
    }

    console.log('Creating user:', { name, email, role });

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(200).json({ message: 'User already exists', user: existingUser });
    }

    // Create and save new user
    const newUser = new User({ name, email, role });
    const savedUser = await newUser.save();
    console.log('User created successfully:', savedUser._id);

    res.status(201).json({ message: 'User created successfully', user: savedUser });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// GET - Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

module.exports = router;