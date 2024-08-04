// Required packages
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;
const uri = 'mongodb+srv://g86KcFT44x5ygs2R:g86KcFT44x5ygs2R@cluster0.mongodb.net/CarsCollection?retryWrites=true&w=majority'; // Replace with your MongoDB connection string
let db;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db('your-database-name'); // Replace with your database name
  })
  .catch(error => console.error(error));

// Serve login.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Simple authentication check (replace with real logic)
    if (username === 'admin' && password === 'password') {
        res.redirect('/admin');
    } else {
        res.send('Invalid username or password');
    }
});

// Serve admin.html at the /admin URL
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve user.html at the /user URL
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'user.html'));
});

// Endpoint to view cars
app.get('/endpoint/viewCars', async (req, res) => {
    try {
        const cars = await db.collection('Cars').find().toArray();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cars' });
    }
});

// Endpoint to add a car
app.post('/endpoint/addCar', async (req, res) => {
    try {
        const car = req.body;
        await db.collection('Cars').insertOne(car);
        res.status(201).json({ message: 'Car added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add car' });
    }
});

// Endpoint to update a car
app.put('/endpoint/updateCar', async (req, res) => {
    try {
        const { _id, name, Year, Price } = req.body;
        await db.collection('Cars').updateOne(
            { _id: new ObjectId(_id) },
            { $set: { name, Year, Price } }
        );
        res.json({ message: 'Car updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update car' });
    }
});

// Endpoint to delete a car
app.delete('/endpoint/deleteCar', async (req, res) => {
    try {
        const { _id } = req.body;
        await db.collection('Cars').deleteOne({ _id: new ObjectId(_id) });
        res.json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete car' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
