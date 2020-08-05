/*
Custom Object Oriented Class for course database.
Written by Mandeep Sran on July 22nd 2020.
Approved and Reviewed by Joseph Power on July 22nd 2020.
*/

const mongoose = require('mongoose');

const { Schema } = mongoose;

const courseSchema = new Schema({
    courseId: {
        type: String,
        required: true,
        trim: true,
    },
    school: {
        type: String,
        trim: true,
        default: 'Generic',
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    level: {
        type: Number,
        min: 1,
        max: 6,
    },
    subject: {
        type: String,
    },
    tutors: Array,
});

courseSchema.index({ courseId: 1, school: 1 }, { unique: true });

/**
 * TODO: Add search for all tutors/types/etc.
 */

const Course = mongoose.model('Course', courseSchema, 'course');

module.exports = { Course };
