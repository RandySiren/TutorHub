/**
 * Render home page/dashboard for logged in user
 */
const getHome = (req, res) => {
    res.render('home', [
        {
            route: '/courses',
            name: 'Courses',
        },
    ]);
};

module.exports = { getHome };
