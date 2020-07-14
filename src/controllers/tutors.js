const chalk = require('chalk');

const { User } = require('../models/User');
const { Course } = require('../models/Course');
const data = require('../routes/data').links;

const getTutorsAdd = (req, res) => {
    return res.render('tutorAdd', data);
};

const getTutorsView = (req, res) => {
    return res.render('tutorView', data);
};
const postTutor = async (req, res, next) => {
    await User.findById(req.user._id, (err, doc) => {
        if (err) return next(err);
        if (doc.clearance < 2) {
            doc.clearance = 2;
            doc.save((err, doc) => {
                if (err) return next(err);
            });
            return res.status(201).redirect('/');
        }
        return res.status(201).redirect('/');
    });
};

const getTutors = async (req, res, next) => {
    await User.find({ clearance: 2 }, (err, docs) => {
        if (err) return next(err);
        return res.send(docs);
    });
};

const getTutorsById = async (req, res, next) => {
    await User.findOne({ _id: req.params.id, clearance: 2 }, (err, doc) => {
        if (err) return next(err);
        return res.send(doc);
    });
};

module.exports = {
    getTutorsAdd,
    getTutorsView,
    postTutor,
    getTutors,
    getTutorsById,
};
