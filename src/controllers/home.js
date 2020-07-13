const data = require('../routes/data').links;
/**
 * Render home page/dashboard for logged in user
 */
const getHome = (req, res) => {
    res.render('home', data);
};

module.exports = { getHome };
