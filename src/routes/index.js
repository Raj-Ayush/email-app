const express = require('express');
const router = express.Router();
const path = require('path');

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Serve home page
router.get('/', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/home.html'));
});

// Serve login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

module.exports = router;
