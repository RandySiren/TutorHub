/*
Tutor Page code Artifact
The code artifact renders tutor data and provides an interface for users, tutors, and administrators.
Code written by Mandeep Sran on July 24th 2020. 
Code was reviewed and approved by Joseph Power on July 24th 2020.
User, Course, and TutorRequest custom data models are loaded from /models/{modelName}
The file provides the following functions:
getTutorsAdd, updateAboutPage, getTutorsView, getTutorsViewById, getTutorsPanel, becomeATutor, getTutors, getTutorsById, getTutorsByCourse, addTutorUser, removeTutorUser,
Artifact accesses the courses database, makes modifications to the TutorRequest and User models. 
*/

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
    const newAbout = {
        aboutInput: '',
        timesInput: '',
        coursesInput: '',
        availabilityInput: '',
    };
    await User.findById(req.user._id, (err, doc) => {
        if (req.body.aboutInput === '') {
            // eslint-disable-next-line prefer-destructuring
            newAbout.aboutInput = doc.about[0];
        } else {
            newAbout.aboutInput = req.body.aboutInput;
        }
        if (req.body.timesInput === '') {
            // eslint-disable-next-line prefer-destructuring
            newAbout.timesInput = doc.about[1];
        } else {
            newAbout.timesInput = req.body.timesInput;
        }
        if (req.body.coursesInput === '') {
            // eslint-disable-next-line prefer-destructuring
            newAbout.coursesInput = doc.about[2];
        } else {
            newAbout.coursesInput = req.body.coursesInput;
        }
        if (req.body.availabilityInput === '') {
            // eslint-disable-next-line prefer-destructuring
            newAbout.availabilityInput = doc.about[3];
        } else {
            newAbout.availabilityInput = req.body.availabilityInput;
        }
    });
    await User.findByIdAndUpdate(req.user._id, {
        about: [
            newAbout.aboutInput,
            newAbout.timesInput,
            newAbout.coursesInput,
            newAbout.availabilityInput,
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
