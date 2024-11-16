// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');
const { authenticateUser } = require('../middleware/authMiddleware');  // JWT verification middleware

const router = express.Router();

// User Registration route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user and hash password
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate JWT token for the new user
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role }, // Payload (userId and role)
      process.env.JWT_SECRET, // JWT secret from .env file
      { expiresIn: '1h' } // Token expiry set to 1 hour
    );

    res.status(201).json({
      message: 'User registered successfully!',
      user: newUser,
      token, // Send the token in the response
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// User Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the entered password with the hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token for the user
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload (userId and role)
      process.env.JWT_SECRET, // JWT secret from .env file
      { expiresIn: '1h' } // Token expiry set to 1 hour
    );

    res.json({
      message: 'Login successful',
      token, // Send the token in the response
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// Upload Assignment route (protected by JWT authentication)
router.post('/upload', authenticateUser, async (req, res) => {
  const { task, admin } = req.body;

  try {
    // Create a new assignment with the authenticated user's ID
    const newAssignment = new Assignment({
      userId: req.user.userId, // Use the userId from the decoded JWT token
      task,
      admin,
    });

    await newAssignment.save();

    res.status(201).json({
      message: 'Assignment uploaded successfully!',
      assignment: newAssignment,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading assignment', error: err });
  }
});

module.exports = router;
