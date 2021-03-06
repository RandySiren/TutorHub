/*
Custom Object Oriented Class for User Model
Written by Mandeep Sran on July 22nd 2020.
Approved and Reviewed by Joseph Power on July 22nd 2020.

This artifact also provides necessary functions for login passport encryption, to ensure security.
*/
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * User entity schema definition
 */
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    courses: {
        type: Array,
        default: [],
    },
    tutors: {
        type: Array,
        default: [],
    },
    clearance: {
        type: Number,
        default: 1,
        min: 1,
        max: 3,
    },
    about: [String],
});

/**
 * Password hash middleware
 */
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            return next();
        });
    });
});

/**
 * Helper method for validating password
 */
userSchema.methods.comparePassword = async function (candidatePassword, cb) {
    const user = this;
    await bcrypt.compare(candidatePassword, user.password, (err, same) => {
        cb(err, same);
    });
};

const User = mongoose.model('User', userSchema, 'users');

module.exports = { User };
