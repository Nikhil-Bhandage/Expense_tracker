// server.js
// Main server file - Entry point of the application

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const { isAuthenticated } = require('./middleware/auth');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make session data available to all views
app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    res.locals.username = req.session.username;
    next();
});

// Routes
app.use('/', authRoutes);
app.use('/api', expenseRoutes);

// Home route - redirect to dashboard if logged in, otherwise login
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Dashboard page
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { username: req.session.username });
});

// Expenses page
app.get('/expenses', isAuthenticated, (req, res) => {
    res.render('expenses', { username: req.session.username });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   💰 Expense Tracker Server Running       ║
║   🌐 URL: http://localhost:${PORT}        ║
║   📊 Environment: ${process.env.NODE_ENV || 'development'}              ║
╚════════════════════════════════════════════╝
    `);
});

module.exports = app;
