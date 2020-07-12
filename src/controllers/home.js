/**
 * Render home page/dashboard for logged in user
 */
const getHome = (req, res) => {
    res.render('home');
};

module.exports = { getHome };
