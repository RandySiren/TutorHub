/* eslint-disable no-shadow */
/* eslint-disable consistent-return */

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
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

/**
 * Password hash middleware
 */
userSchema.pre('save', async (next) => {
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

const User = mongoose.model('User', userSchema, 'users');

module.exports = { User };
