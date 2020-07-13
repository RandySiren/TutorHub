const data = require('../routes/data').links;
/**
 * Render home page/dashboard for logged in user
 */
const getHome = (req, res) => {
    res.render('home', {
        data: data.data,
        menu: data.menu,
    });
};

module.exports = { getHome };
