const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// 🔹 Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// 🔹 Method to validate password
userSchema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);



