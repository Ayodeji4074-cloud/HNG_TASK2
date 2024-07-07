require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/db');

const app = express();

// Middleware
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/api/organisations', require('./routes/organisationRoutes'));

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
