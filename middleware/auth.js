// middleware/auth.js
// Authentication middleware to protect routes

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is authenticated, proceed to next middleware/route
        return next();
    }
    // User is not authenticated, redirect to login
    res.redirect('/login');
};

// Check if user is NOT authenticated (for login/signup pages)
const isNotAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is already logged in, redirect to dashboard
        return res.redirect('/dashboard');
    }
    // User is not authenticated, proceed
    next();
};

module.exports = {
    isAuthenticated,
    isNotAuthenticated
};
