const chalk = require('chalk');

const { User } = require('../models/User');
const { Course } = require('../models/Course');

const data = require('../routes/data').links;

const getCoursesHome = (req, res) => {
    return res.render('course', data);
};

const getCoursesAdd = (req, res) => {
    return res.render('courseAdd', data);
};

const getCoursesView = (req, res) => {
    return res.render('courseView', data);
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
        return res.status(201).redirect('../../courses');
    });
};

const getCourses = async (req, res, next) => {
    await Course.find({}, (err, docs) => {
        if (err) return next(err);
        return res.send(docs);
    });
};

const getCourseById = async (req, res, next) => {
    await Course.findOne({ _id: req.params.id }, (err, doc) => {
        if (err) return next(err);
        return res.send(doc);
    });
};

const addCourseUser = async (req, res, next) => {
    await User.findById(req.user._id, (err, doc) => {
        const courseId = req.params.id;
        if (err) return next(err);
        if (!doc.courses.includes(courseId)) {
            doc.courses.push(courseId);
            doc.save((err, doc) => {
                if (err) return next(err);
            });
            return res.send({ message: 'Added' });
        }
        return res.send({ message: 'Not added' });
    });
};

module.exports = {
    getCoursesHome,
    getCoursesAdd,
    getCoursesView,
    postCourse,
    getCourses,
    getCourseById,
    addCourseUser,
};
