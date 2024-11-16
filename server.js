// Importing required dependencies
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import routes
const userRoutes = require('./routes/userRoutes');  // Add this line to import your user routes

// Load environment variables from .env file (only once)
dotenv.config();  // Only this line is needed

// Create an Express app
const app = express();

// Middleware
app.use(express.json()); // For parsing JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

console.log('Mongo URI:', process.env.MONGO_URI);  // This will print the value of the MONGO_URI to the console

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

// Use the user routes for all requests starting with `/`
app.use('/', userRoutes);  // This line registers your user-related routes (i.e., `/register`, `/login`)

// Example route
app.get('/', (req, res) => {
  res.send('Hello, MongoDB!');
});

// Server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
