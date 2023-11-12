const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors())
app.use(bodyParser.json())

// Endpoint for user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile('data/users.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        const users = JSON.parse(data).users;
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            var secretKey = "123"
            // You might use a library like jsonwebtoken to generate tokens here
            const token = jwt.sign({ user }, secretKey, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});


// API endpoint to handle the request
app.post('/api/students', (req, res) => {
    try {
      // Read data from the JSON file (replace 'data.json' with your actual file name)
      const jsonData = JSON.parse(fs.readFileSync('data/students.json', 'utf8'));
  
      // Process the request data
      const requestData = req.body;
  
      // Your logic to process the request and get the result from jsonData
      const result = processData(requestData, jsonData);
  
      // Return the result as JSON
      res.json(result);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  function processData(requestData, jsonData) {

    let data = jsonData;
    let filterType = requestData.filter;
    let year = requestData.year;
    let studentClass = requestData.class;
    // Apply filters
    if (filterType) {
        data = data.filter(student => student.category === filterType);
    }

    if (year) {
        data = data.filter(student => student.year === year);
    }

    if (studentClass) {
        data = data.filter(student => student.class === studentClass);
    }
    return { message: 'Successfully processed request', data };
  }

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});