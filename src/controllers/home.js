/*
Artifact for Homepage
Written by Mandeep Sran on July 12th 2020. 
Reviewed by Joseph Power and approved on July 12th 2020. 
Loads homepage data upon successful login redirect, renders html/css data.
No input / output or error-handling (Not necessary).
Checks User data for clearance level, tutors and administrators will have a slightly different homepage than normal users.
*/

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
