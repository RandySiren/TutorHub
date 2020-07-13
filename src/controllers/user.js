const passport = require('passport');
const chalk = require('chalk');

const { User } = require('../models/User');
const data = require('../routes/data').links;

const getLogin = (req, res) => {
    if (req.user) return res.redirect('/');
    return res.render('login', data);
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

const getSignup = (req, res) => {
    if (req.user) return res.redirect('/');
    return res.render('signup', data);
};

const postSignup = async (req, res, next) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
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

const getUsers = async (req, res, next) => {
    await User.find({}, (err, docs) => {
        if (err) return next(err);
        return res.send(docs);
    });
};

const getUserById = async (req, res, next) => {
    await User.findOne({ _id: req.params.id }, (err, doc) => {
        if (err) return next(err);
        return res.send(doc);
    });
};

module.exports = {
    getLogin,
    postLogin,
    getSignup,
    postSignup,
    getUsers,
    getUserById,
};
