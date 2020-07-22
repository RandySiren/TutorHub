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
