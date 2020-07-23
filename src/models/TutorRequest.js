const mongoose = require('mongoose');

const { Schema } = mongoose;

const tutorRequestSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
});

const TutorRequest = mongoose.model(
    'TutorRequest',
    tutorRequestSchema,
    'tutorRequest'
);

module.exports = { TutorRequest };
