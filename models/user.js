const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    settings: {
        lowThreshold: { type: Number, default: 4.0 },   // mmol/L
        highThreshold: { type: Number, default: 7.8 }, // mmol/L
        units: { type: String, default: 'mmol/L' }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
