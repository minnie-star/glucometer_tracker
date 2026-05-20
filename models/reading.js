const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    glucoseLevel: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    context: {
        meal: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], default: 'Snack' },
        exercise: { type: String },
        notes: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Reading', readingSchema);
