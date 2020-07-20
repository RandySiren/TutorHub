const chalk = require('chalk');

const { User } = require('../models/User');
const { Course } = require('../models/Course');
const { TutorRequest } = require('../models/TutorRequest');
const data = require('../routes/data').links;

const getTutorsAdd = (req, res) => {
    const mutatedData = { ...data };
    if (req.user.clearance === 2) {
        mutatedData.showTutor = true;
    } else if (req.user.clearance === 3) {
        mutatedData.showAdmin = true;
        mutatedData.showTutor = true;
    }
    return res.render('tutorAdd', mutatedData);
};

const getTutorsView = (req, res) => {
    const mutatedData = { ...data };
    if (req.user.clearance === 2) {
        mutatedData.showTutor = true;
    } else if (req.user.clearance === 3) {
        mutatedData.showAdmin = true;
        mutatedData.showTutor = true;
    }
    return res.render('tutorView', mutatedData);
};

const getTutorsViewById = async (req, res, next) => {
    const mutatedData = { ...data, tutor: 'test' };
    if (req.user.clearance === 2) {
        mutatedData.showTutor = true;
    } else if (req.user.clearance === 3) {
        mutatedData.showAdmin = true;
        mutatedData.showTutor = true;
    }
    await User.findOne(
        { _id: req.params.id, clearance: { $gte: 2 } },
        { password: 0 },
        (err, doc) => {
            if (err) return next(err);
            mutatedData.tutor = doc;
            return res.render('tutorPage', mutatedData);
        }
    );
};

const getTutorsPanel = (req, res) => {
    const mutatedData = { ...data };
    if (req.user.clearance === 2) {
        mutatedData.showTutor = true;
    } else if (req.user.clearance === 3) {
        mutatedData.showAdmin = true;
        mutatedData.showTutor = true;
    }
    return res.render('tutor', mutatedData);
};
const becomeATutor = async (req, res, next) => {
    await User.findById(req.user._id, async (err, doc) => {
        if (err) return next(err);
        if (doc.clearance < 2) {
            const tutorRequest = new TutorRequest({
                userId: doc._id,
            });
            await tutorRequest.save((err, doc) => {
                if (err) return next(err);
            });
            return res.status(201).redirect('/');
        }
        return res.status(201).redirect('/');
    });
};

const getTutors = async (req, res, next) => {
    await User.find({ clearance: 2 }, { password: 0 }, (err, docs) => {
        if (err) return next(err);
        return res.send(docs);
    });
};

const getTutorsById = async (req, res, next) => {
    await User.findOne(
        { _id: req.params.id, clearance: 2 },
        { password: 0 },
        (err, doc) => {
            if (err) return next(err);
            return res.send(doc);
        }
    );
};

const getTutorsByCourse = async (req, res, next) => {
    await User.find(
        { clearance: { $gte: 2 }, courses: req.params.id },
        { password: 0 },
        (err, doc) => {
            if (err) return next(err);
            return res.send(doc);
        }
    );
};

module.exports = {
    getTutorsAdd,
    getTutorsView,
    getTutorsViewById,
    getTutorsPanel,
    becomeATutor,
    getTutors,
    getTutorsById,
    getTutorsByCourse,
};
