const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Serve frontend from ../frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/test-email', (req, res) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER,
    subject: 'Test Email from Scriptobot',
    text: 'This is a test email to confirm setup.'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Email send error:", error);
      return res.status(500).send(`Email failed: ${error.message}`);
    }
    res.status(200).send('✅ Test email sent!');
  });
});


// Configure Multer for file uploads
const upload = multer({ dest: 'backend/uploads/' });

// Email Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Handle PDF upload and send by email
app.post('/upload', upload.single('pdfUpload'), (req, res) => {
  if (!req.file) {
    console.error("❌ No file uploaded.");
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;
  const fileName = req.file.originalname;

  console.log("📄 File received:", fileName);

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
    fs.unlinkSync(filePath); // cleanup
    if (error) {
      console.error("❌ Email send error:", error);
      return res.status(500).send('Email failed: ' + error.message);
    }

    console.log("✅ Email sent from form:", info.response);
    res.status(200).send('Email sent successfully!');
  });
});
// All your routes and logic above...

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
