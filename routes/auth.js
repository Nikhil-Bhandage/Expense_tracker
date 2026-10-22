// routes/auth.js
// Authentication routes - signup, login, logout

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { isNotAuthenticated } = require('../middleware/auth');

// GET - Signup page
router.get('/signup', isNotAuthenticated, (req, res) => {
    res.render('signup', { error: null });
});

// POST - Signup (Create new user)
router.post('/signup', isNotAuthenticated, async (req, res) => {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
        return res.render('signup', { error: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.render('signup', { error: 'Password must be at least 6 characters' });
    }

    try {
        // Check if user already exists
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.render('signup', { error: 'Username or email already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const [result] = await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // Auto login after signup
        req.session.userId = result.insertId;
        req.session.username = username;
        
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Signup error:', error);
        res.render('signup', { error: 'An error occurred. Please try again.' });
    }
});

// GET - Login page
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login', { error: null });
});

// POST - Login
router.post('/login', isNotAuthenticated, async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.render('login', { error: 'Email and password are required' });
    }

    try {
        // Find user by email
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        const user = users[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.render('login', { error: 'Invalid email or password' });
        }

        // Create session
        req.session.userId = user.id;
        req.session.username = user.username;

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
});

// GET - Logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/login');
    });
});

module.exports = router;
