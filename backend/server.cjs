const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configure Multer
const upload = multer({ dest: 'backend/uploads/' });

// Email Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Endpoint to receive the file
app.post('/upload', upload.single('pdfUpload'), (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER,
    subject: 'New Homework PDF Submission',
    text: 'A new homework PDF has been submitted.',
    attachments: [
      {
        filename: fileName,
        path: filePath
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    fs.unlinkSync(filePath);
    if (error) {
      console.error(error);
      return res.status(500).send('Email failed.');
    }
    res.status(200).send('Email sent successfully!');
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
