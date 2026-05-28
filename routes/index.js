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
const passport = require('passport');
const router = express.Router();

// Swagger docs
router.use('/api-docs', require('./swagger'));

// User and reading routes
router.use('/users', require('./userRoutes'));
router.use('/readings', require('./readingRoutes'));

// GitHub login
router.get('/login', passport.authenticate('github'));

// GitHub callback
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// GitHub logout
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
