const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');  // Allow cross-origin requests

const app = express();
const port = process.env.PORT || 3001;  // Uses Heroku's PORT or 3001 locally

// Middleware
app.use(bodyParser.json());
app.use(cors());  // Allow all origins

// Log requests (for debugging)
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Root route to prevent 404 errors on the homepage
app.get('/', (req, res) => {
  res.send('Server is running! Use API endpoints.');
});

// Get questions for a participant
app.get('/questions/:participantId', (req, res) => {
  const participantId = req.params.participantId;
  const filePath = path.join(__dirname, `questions_${participantId}.json`);
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(404).json({ error: 'File not found' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Save responses
app.post('/responses', (req, res) => {
  const newResponses = req.body;
  const filePath = path.join(__dirname, 'responses.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    let existingResponses = [];
    if (!err && data) {
      existingResponses = JSON.parse(data);
    }
    if (!Array.isArray(existingResponses)) {
      existingResponses = [];
    }
    existingResponses.push(newResponses);

    fs.writeFile(filePath, JSON.stringify(existingResponses, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error saving responses:', writeErr);
        res.status(500).json({ error: 'Error saving responses' });
      } else {
        res.json({ message: 'Responses saved successfully' });
      }
    });
  });
});

// Retrieve responses
app.get('/responses', (req, res) => {
  const filePath = path.join(__dirname, 'responses.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading responses file:', err);
      res.status(404).json({ error: 'No responses found' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Start server, ensuring Heroku's PORT binding
app.listen(port, '0.0.0.0', () => {
  console.log(`Backend server running on port ${port}`);
});
