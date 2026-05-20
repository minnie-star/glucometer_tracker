const { validationResult } = require('express-validator');
const Reading = require('../models/reading');

exports.getAllReadings = async (req, res) => {
    try {
        const readings = await Reading.find().sort({ timestamp: -1 });
        res.json(readings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching readings', error: error.message });
    }
};


exports.addReading = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { userId, glucoseLevel, context } = req.body;
        const newReading = new Reading({ userId, glucoseLevel, context });
        const savedReading = await newReading.save();
        res.status(201).json(savedReading);
    } catch (error) {
        res.status(500).json({ message: 'Error adding reading', error: error.message });
    }
};

// Get all readings for a user
exports.getReadings = async (req, res) => {
    try {
        const { userId } = req.params;
        const readings = await Reading.find({ userId }).sort({ timestamp: -1 });
        res.json(readings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching readings', error: error.message });
    }
};

// Get a single reading by ID
exports.getReadingById = async (req, res) => {
    try {
        const reading = await Reading.findById(req.params.id);
        if (!reading) return res.status(404).json({ message: 'Reading not found' });
        res.json(reading);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reading', error });
    }
};

// Update a reading
exports.updateReading = async (req, res) => {
    try {
        const updatedReading = await Reading.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedReading) return res.status(404).json({ message: 'Reading not found' });
        res.json(updatedReading);
    } catch (error) {
        res.status(500).json({ message: 'Error updating reading', error });
    }
};

// Delete a reading
exports.deleteReading = async (req, res) => {
    try {
        const deletedReading = await Reading.findByIdAndDelete(req.params.id);
        if (!deletedReading) return res.status(404).json({ message: 'Reading not found' });
        res.json({ message: 'Reading deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting reading', error });
    }
};

