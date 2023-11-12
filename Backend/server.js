const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors())
app.use(bodyParser.json({ limit: '200mb' }))

let dataFilePath = 'data/students.json';
let students = [];
if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    students = JSON.parse(data);
}
// Helper function to read data from the JSON file
// const readData = async () => {
//     try {
//       const data = await fs.readFile(dataFilePath, 'utf-8');
//       return JSON.parse(data);
//     } catch (error) {
//       console.error('Error reading data:', error);
//       return [];
//     }
//   };

// Helper function to write data to the JSON file
const writeData = (data) => {
    try {
        // Write the updated student data back to the file
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data:', error);
    }
};

app.post('/api/addstudent', (req, res) => {
    const newStudent = req.body;

    if (!newStudent || !newStudent.id || !newStudent.name) {
        return res.status(400).json({ error: 'Invalid student data' });
    }

    students.push(newStudent);

    // Write the updated student data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(students, null, 2));

    res.status(201).json(newStudent);
});

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
        // Process the request data
        const requestData = req.body;

        // Your logic to process the request and get the result from jsonData
        const result = processData(requestData);

        // Return the result as JSON
        res.json(result);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function processData(requestData) {
    let data = students;
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


// Delete a student by ID
app.delete('/api/students/:id', async (req, res) => {
    const index = students.findIndex(s => s.id == req.params.id);
    if (index !== -1) {
        students.splice(index, 1);
        writeData(students);
        res.json({ message: 'Student deleted successfully' });
    } else {
        res.status(404).json({ error: 'Student not found' });
    }
});


// Update student endpoint
app.put('/api/students/:id', async (req, res) => {
    const index = students.findIndex(s => s.id == req.params.id);
  
    if (index !== -1) {
      students[index] = { ...students[index], ...req.body };
      console.log(students[index])
      writeData(students);
  
      res.json({ message: 'Student updated successfully' });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  });

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});