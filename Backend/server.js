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

    fs.readFile('users.json', 'utf8', (err, data) => {
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

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});