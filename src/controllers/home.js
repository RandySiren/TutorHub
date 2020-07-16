const data = require('../routes/data').links;
/**
 * Render home page/dashboard for logged in user
 */
const getHome = (req, res) => {
    const mutatedData = { ...data };
    res.render('home', mutatedData);
};

module.exports = { getHome };
