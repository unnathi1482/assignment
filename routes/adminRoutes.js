// routes/adminRoutes.js
const express = require('express');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');  // Import the middleware
const Assignment = require('../models/assignmentModel');
const router = express.Router();

// Admin can view all assignments
router.get('/assignments', authenticateUser, isAdmin, async (req, res) => {
  try {
    // Get all assignments, populate the user details (username, email)
    const assignments = await Assignment.find().populate('userId', 'username email');
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving assignments', error });
  }
});

// Admin can accept or reject an assignment
router.put('/assignments/:id', authenticateUser, isAdmin, async (req, res) => {
  const { status } = req.body;  // Status should be "accepted" or "rejected"

  // Validate the status input
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be "accepted" or "rejected".' });
  }

  try {
    // Update the assignment's status by ID
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }  // Return the updated assignment
    );

    // If assignment not found, send an error
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Successfully updated, return the updated assignment
    res.json({ message: 'Assignment status updated', assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating assignment', error });
  }
});

module.exports = router;
