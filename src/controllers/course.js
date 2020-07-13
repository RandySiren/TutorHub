const chalk = require('chalk');

const { User } = require('../models/User');
const { Course } = require('../models/Course');

const getCourseHome = (req, res) => {
    return res.render('course', { title: 'Course' });
};

const postCourse = async (req, res, next) => {
    const course = new Course({
        courseId: req.body.courseId,
        name: req.body.name,
        subject: req.body.subject,
        school: req.body.school,
        level: req.body.level,
    });
    await course.save((err, doc) => {
        if (err) {
            if (err.code === 11000) {
                console.error(chalk.red('Course/School combaination in use'));
                return res.status(400).redirect('../../courses');
            }
            return next(err);
        }
        console.log('Successfully added!');
        console.log(doc);
        return res.status(201).redirect('../../courses');
    });
};

const getCourses = async (req, res, next) => {
    await Course.find({}, (err, docs) => {
        if (err) return next(err);
        return res.send(docs);
    });
};

module.exports = { getCourseHome, postCourse, getCourses };
