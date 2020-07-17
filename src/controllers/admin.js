const data = require('../routes/data').links;

const getAdminHome = (req, res) => {
    const mutatedData = { ...data };
    if (req.user.clearance === 2) {
        mutatedData.showTutor = true;
    } else {
        mutatedData.showAdmin = true;
        mutatedData.showTutor = true;
    }
    res.render('admin', mutatedData);
};

module.exports = { getAdminHome };
