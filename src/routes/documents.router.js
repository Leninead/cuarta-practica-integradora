// src/routes/documents.router.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');
const documentsController = require('../controllers/documents.controller'); // Import the documents controller

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination folder based on file type or any other criteria
    // For example, create different folders for images and documents
    if (file.mimetype.startsWith('image/')) {
      cb(null, 'uploads/images/');
    } else {
      cb(null, 'uploads/documents/');
    }
  },
  filename: function (req, file, cb) {
    // Customize the filename if needed (e.g., add timestamp to avoid overwrites)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// POST method for uploading one or multiple files
router.post('/:uid/documents', passport.authenticate('jwt', { session: false }), upload.array('files'), (req, res) => {
  // Handle file upload logic in the controller
  documentsController.uploadDocuments(req, res);
});

module.exports = router;
