const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const db = require('./db');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'very_secret_key',  // Choose a strong secret for session management
    resave: false,
    saveUninitialized: false
}));

// Dummy user database
const users = {};

// Middleware to check if user is logged in
function checkAuthenticated(req, res, next) {
    if (!req.session.username) {
        return res.redirect('/login.html');  // Direct them to login if not authenticated
    }
    next();
}

// Serve the main page with images, ensuring user is authenticated
app.get('/', checkAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Handle user registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        return res.send('Username already exists');
    }
    users[username] = { password };
    req.session.username = username;
    res.redirect('/');
});

// Handle user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users[username];
    if (user && user.password === password) {
        req.session.username = username;
        res.redirect('/');
    } else {
        res.send('Login failed');
    }
});

// Logout handler
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
