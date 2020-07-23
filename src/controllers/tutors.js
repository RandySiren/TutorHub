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

const updateAboutPage = async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, {
        about: [
            req.body.aboutInput,
            req.body.timesInput,
            req.body.coursesInput,
            req.body.availabilityInput,
        ],
    }).exec();
    res.redirect('/tutor/panel');
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
    await User.find(
        { clearance: { $gte: 2 } },
        { password: 0 },
        (err, docs) => {
            if (err) return next(err);
            return res.send(docs);
        }
    );
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

const addTutorUser = async (req, res, next) => {
    await User.findById(req.user._id, (err, doc) => {
        const tutorId = req.params.id;
        if (err) return next(err);
        if (!doc.tutors.includes(tutorId)) {
            doc.tutors.push(tutorId);
            doc.save((err, doc) => {
                if (err) return next(err);
            });
            return res.send({ message: 'Added' });
        }
        return res.send({ message: 'Not added' });
    });
};

const removeTutorUser = async (req, res, next) => {
    await User.findById(req.user._id, (err, doc) => {
        const tutorId = req.params.id;
        if (err) return next(err);
        if (doc.tutors.includes(tutorId)) {
            const index = doc.tutors.indexOf(tutorId);
            doc.tutors.splice(index, 1);
            doc.save((err, doc) => {
                if (err) return next(err);
            });
            return res.send({ message: 'Removed' });
        }
        return res.send({ message: 'Not removed' });
    });
};

module.exports = {
    getTutorsAdd,
    updateAboutPage,
    getTutorsView,
    getTutorsViewById,
    getTutorsPanel,
    becomeATutor,
    getTutors,
    getTutorsById,
    getTutorsByCourse,
    addTutorUser,
    removeTutorUser,
};
