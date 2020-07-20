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
module.exports = {
    getLogin,
    postLogin,
    getLogout,
    getSignup,
    postSignup,
    getSettingsPage,
    getCurrentUserData,
    getUsers,
    getUserById,
    getUserCourses,
};
