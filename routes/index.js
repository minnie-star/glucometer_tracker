// const router = require('express').Router();
// const passport = require('passport');
// const { isAuthenticated } = require('../middleware/authenticate');


// router.use("/api-docs", require("./swagger"));
// router.use('/users', require('./userRoutes'));
// router.use('/readings', require('./readingRoutes'));

// router.get('/login', passport.authenticate('github'), (req, res) => {});

// router.get('/logout', isAuthenticated, function(req, res, next) {
//     req.logout(function(err) {
//         if (err) { return next(err);}
//         res.redirect('/');
//     })
// })

// module.exports = router;

const express = require('express');
const isAuthenticated = require('../middleware/authenticate');
const router = express.Router();

// Swagger docs
router.use('/api-docs', require('./swagger'));

// Auth routes
router.use('/api/auth/github', require('./authRoutes'));

// User and reading routes
router.use('/api/users', require('./userRoutes'));
router.use('/api/readings', isAuthenticated, require('./readingRoutes'));

module.exports = router;
