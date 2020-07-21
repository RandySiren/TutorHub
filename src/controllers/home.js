const data = require('../routes/data').links;
/**
 * Render home page/dashboard for logged in user
 */
const getHome = (req, res) => {
    const mutatedData = { ...data };
    if (req.user.clearance === 2) {
        mutatedData.showTutor = true;
    } else if (req.user.clearance === 3) {
        mutatedData.showAdmin = true;
        mutatedData.showTutor = true;
    }
    res.render('home', mutatedData);
};

module.exports = { getHome };
