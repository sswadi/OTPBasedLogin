const express = require('express');
const port = 8000;
const mongoose = require('mongoose');
const routes = require('./routes/routes');

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/OTPBased_Login1', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/', routes);

// Start the server

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
