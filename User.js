const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
const User = require('./models/User');

// Registration route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ message: 'Login successful', userName: user.name });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://myUser:myPassword@cluster0.mongodb.net/quiz-app?retryWrites=true&w=majority';
let db;

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db('quiz-app'); // Use or create the 'quiz-app' database
        console.log('Connected to MongoDB');
    })
    .catch(error => console.error('Error connecting to MongoDB:', error));
// Registration route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        await db.collection('users').insertOne({ name, email, password });
        res.status(201).json({ message: 'Registration successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.collection('users').findOne({ email, password });
        if (user) {
            res.json({ message: 'Login successful', userName: user.name });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});
