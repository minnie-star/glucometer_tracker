const { validationResult } = require('express-validator');
const User = require('../models/user');

// Get all users (hide passwordHash)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Register new user
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ username, email, passwordHash: password });
        const savedUser = await newUser.save();

        res.status(201).json({ 
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            settings: savedUser.settings
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isValid = await user.validatePassword(password);
        if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

        // Store user in session
        req.session.user = { id: user._id, username: user.username, email: user.email };
        res.json({ message: 'Login successful', user: req.session.user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Logout user
exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Logout failed', error: err });
        res.json({ message: 'Logged out successfully' });
    });
};

// Get user by ID
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

// Update user settings
exports.updateUserSettings = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { settings: req.body.settings },
            { new: true }
        ).select('-passwordHash');
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

