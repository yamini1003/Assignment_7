const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// In-memory storage for users and quizzes (use a database in production)
const users = [];
const quizzes = {
    html: [
        { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Tabular Markup Language", "None of these"], answer: "Hyper Text Markup Language" },
        { question: "Who is making the Web standards?", options: ["Mozilla", "Google", "The World Wide Web Consortium", "Microsoft"], answer: "The World Wide Web Consortium" }
    ],
    css: [
        { question: "What does CSS stand for?", options: ["Colorful Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets"], answer: "Cascading Style Sheets" },
        { question: "Where in an HTML document can you put CSS?", options: ["In the <head> section", "In the <body> section", "Both the <head> section and the <body> section", "In the <footer> section"], answer: "Both the <head> section and the <body> section" }
    ]
};

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.status(400).json({ message: 'Email already registered.' });
    }

    users.push({ name, email, password });
    res.status(201).json({ message: 'Registration successful! You can now log in.' });
});
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        res.json({ message: 'Login successful', userName: user.name });
    } else {
        res.status(401).json({ message: 'Invalid email or password.' });
    }
});
app.get('/quiz/:category', (req, res) => {
    const { category } = req.params;
    const quiz = quizzes[category];

    if (quiz) {
        res.json(quiz);
    } else {
        res.status(404).json({ message: 'Quiz category not found' });
    }
});
app.post('/submit-quiz', (req, res) => {
    const { category, answers } = req.body;
    const quiz = quizzes[category];

    if (!quiz) {
        return res.status(404).json({ message: 'Quiz category not found' });
    }

    let score = 0;
    quiz.forEach((question, index) => {
        if (question.answer === answers[index]) {
            score++;
        }
    });

    res.json({ score, total: quiz.length });
});
require('dotenv').config();
