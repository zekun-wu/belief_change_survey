const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;


app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/questions/:participantId', (req, res) => {
  const participantId = req.params.participantId;
  const filePath = path.join(__dirname, `questions_${participantId}.json`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(404).send('File not found');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

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
        res.status(500).send('Error saving responses');
      } else {
        res.send('Responses saved successfully');
      }
    });
  });
});

app.get('/responses', (req, res) => {
  const filePath = path.join(__dirname, 'responses.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(404).send('No responses found');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});