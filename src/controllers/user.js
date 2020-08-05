/*
User Module 
This artifact loads user data upon a successful login attempt, including but not limited to:
-Name, Settings, Courses, Tutors
Also loads the About and Home pages.

Code written by Mandeen Sran on July 22nd 2020. 
Code reviewed and approved by Joseph Power on July 22nd 2020. 
The artifacts assesses user and course models, located in /models/{ModelName}
The artifact provides the following necessary functions to implement use cases of the user model:
- getLogin, postLogin, getLogout, getSignup, postSignup, getAbout, getHome, getSettingsPage, getCurrentUserData, getUsers, getUserById, getUserCourses, getUserTutors,
All functions provide necessary error handling to ensure the users session does not terminate during unexpected behaviour.
*/

const passport = require('passport');
const chalk = require('chalk');

const { User } = require('../models/User');
const { Course } = require('../models/Course');
const data = require('../routes/data').links;

const getLogin = (req, res) => {
    if (req.user) return res.redirect('/');
    const mutatedData = { ...data };
    mutatedData.showFullNavbar = false;
    mutatedData.showFullSidebar = false;
    return res.render('login', mutatedData);
};

const postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            console.log(chalk.red('INCORRECT INFO'));
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            console.log(chalk.green('LOGGED IN'));
            return res.redirect('/');
        });
    })(req, res, next);
};

const getLogout = (req, res, next) => {
    req.logout();
    req.session.destroy((err) => {
        if (err) return next(err);
        req.user = null;
        res.redirect('/');
    });
};

const getSignup = (req, res) => {
    if (req.user) return res.redirect('/');
    const mutatedData = { ...data };
    mutatedData.showFullNavbar = false;
    mutatedData.showFullSidebar = false;
    return res.render('signup', mutatedData);
};

const postSignup = async (req, res, next) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        clearance: 1,
        courses: [],
        name: req.body.name,
    });
    await user.save((err, doc) => {
        if (err) {
            if (err.code === 11000) {
                console.error(chalk.red('Email in use')); // TODO: Replace with flash message
                return res.status(400).redirect('signup');
            }
            return next(err);
        }
        console.log('Successfully registered!'); // TODO: Delete later
        return res.status(201).redirect('login');
    });
};

const getAbout = async (req, res, next) => {
    if (req.user) return res.redirect('/');
    const mutatedData = { ...data };
    mutatedData.showFullNavbar = false;
    mutatedData.showFullSidebar = false;
    return res.render('about', mutatedData);
};

const getHome = async (req, res, next) => {
    if (req.user) return res.redirect('/');
    const mutatedData = { ...data };
    mutatedData.showFullNavbar = false;
    mutatedData.showFullSidebar = false;
    return res.render('home2', mutatedData);
};

const getSettingsPage = async (req, res, next) => {
    const mutatedData = { ...data };
    if (req.user.clearance === 2) {
        mutatedData.showTutor = true;
    } else if (req.user.clearance === 3) {
        mutatedData.showAdmin = true;
        mutatedData.showTutor = true;
    }
    res.render('settings', mutatedData);
};

const getCurrentUserData = async (req, res, next) => {
    if (req.user === undefined) {
        return res.send({});
    }
    return res.send(req.user);
};

const getUsers = async (req, res, next) => {
    await User.find({}, (err, docs) => {
        if (err) return next(err);
        return res.send(docs);
    });
};

const getUserById = async (req, res, next) => {
    await User.findOneById(req.params.id, (err, doc) => {
        if (err) return next(err);
        return res.send(doc);
    });
};

const getUserCourses = async (req, res, next) => {
    await User.findById(req.params.id, async (err, doc) => {
        return res.send(
            await Promise.all(
                doc.courses.map((courseRawId) =>
                    Course.findById(courseRawId, (err, doc) => doc)
                )
            )
        );
    });
};

const getUserTutors = async (req, res, next) => {
    await User.findById(req.params.id, async (err, doc) => {
        return res.send(
            await Promise.all(
                doc.tutors.map((tutorRawId) =>
                    User.findById(tutorRawId, (err, doc) => doc)
                )
            )
        );
    });
};
module.exports = {
    getLogin,
    postLogin,
    getLogout,
    getSignup,
    postSignup,
    getAbout,
    getHome,
    getSettingsPage,
    getCurrentUserData,
    getUsers,
    getUserById,
    getUserCourses,
    getUserTutors,
};
