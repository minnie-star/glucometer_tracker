const express = require('express');
const passport = require('passport');
const router = express.Router();

// GitHub login route
router.get('/',
  passport.authenticate('github')
);

// GitHub callback route
router.get('/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

module.exports = router;
