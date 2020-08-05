/*
Administrator Panel
This code module will be loaded for users who log in that have level 3 clearance (Admins).
This artifact allows an administrator to:
    - View all tutor applications
    - Accept tutor applications
    - Deny tutor applications

Written by Mandeep Sran on July 20th 2020. Reviewed by Joseph Power on July 20th 2020 and approved. 
Module contains 4 functions that are loaded upon login: getAdminHome, getTutorRequests, acceptTutor, denyTutor,
A TutorRequest is a custom data model defined in /models/TutorRequest, as well as User defined in /models/User
This code artifact does not have explicit I/O, but will connect with front end code to show open Tutor Applications, and have them removed from the site when they are rejected / accepted. 
This code will access tutor applications stored within the Mongo Database, through the server connection only.
*/

const { TutorRequest } = require('../models/TutorRequest');
const { User } = require('../models/User');

const data = require('../routes/data').links;

const getAdminHome = (req, res) => {
    const mutatedData = { ...data };
    if (req.user.clearance === 2) {
        mutatedData.showTutor = true;
    } else if (req.user.clearance === 3) {
        mutatedData.showAdmin = true;
        mutatedData.showTutor = true;
    }
    res.render('admin', mutatedData);
};

const getTutorRequests = async (req, res, next) => {
    await TutorRequest.find({}, async (err, doc) => {
        return res.send(
            await Promise.all(
                doc.map((tutorRequest) =>
                    User.findById(tutorRequest.userId, (err, doc) => doc)
                )
            )
        );
    });
};

const acceptTutor = async (req, res, next) => {
    TutorRequest.findOne({ userId: req.params.id }, (err, doc) => {
        if (err) return next(err);
        User.findByIdAndUpdate(doc.userId, { clearance: 2 }).exec();
        doc.remove();
        res.redirect('/admin/panel');
    });
};

const denyTutor = async (req, res, next) => {
    TutorRequest.findOneAndDelete({ userId: req.params.id }, (err, doc) => {
        if (err) return next(err);
        res.redirect('/admin/panel');
    });
};

module.exports = {
    getAdminHome,
    getTutorRequests,
    acceptTutor,
    denyTutor,
};
