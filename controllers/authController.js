const User = require('../models/user');
const passport = require('passport');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    await user.setPassword(password);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = passport.authenticate('local', {
  successRedirect: '/api/readings',
  failureRedirect: '/login',
  failureFlash: true
});

exports.logout = (req, res) => {
  req.logout(function(err) {
    if (err) return res.status(500).json({ message: 'Logout failed', error: err });
    res.json({ message: 'Logged out successfully' });
  });
};
