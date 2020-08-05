/*
Custom Object Oriented Class for tutor requests.
Written by Mandeep Sran on July 22nd 2020.
Approved and Reviewed by Joseph Power on July 22nd 2020.
*/

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
