// models/assignmentModel.js
const mongoose = require('mongoose');

// Define the assignment schema
const assignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  admin: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending', // Default status is 'pending'
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Create and export the Assignment model
module.exports = mongoose.model('Assignment', assignmentSchema);
