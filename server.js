const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Dynamically import node-fetch
let fetch;
(async () => {
  fetch = (await import('node-fetch')).default;
})();

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simple authentication check (for demo purposes)
  if (username === 'admin' && password === 'password') {
    res.redirect('/admin.html');
  } else if (username === 'user' && password === 'password') {
    res.redirect('/user.html');
  } else {
    res.send('Invalid credentials');
  }
});

// View Cars
app.get('/viewCars', async (req, res) => {
  try {
    const response = await fetch('https://ap-south-1.aws.data.mongodb-api.com/app/application-1-zuqzzgn/endpoint/viewCars');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching cars');
  }
});

// Add Car
app.post('/addCar', async (req, res) => {
  try {
    const response = await fetch('https://ap-south-1.aws.data.mongodb-api.com/app/application-1-zuqzzgn/endpoint/addCar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error adding car');
  }
});


// Delete Car
app.delete('/delCar', async (req, res) => {
  try {
    const response = await fetch('https://ap-south-1.aws.data.mongodb-api.com/app/application-1-zuqzzgn/endpoint/delCar', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error deleting car');
  }
});

// Serve the login form
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve the admin page
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve the user page
app.get('/user.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'user.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
