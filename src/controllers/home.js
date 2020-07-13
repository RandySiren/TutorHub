/**
 * Render home page/dashboard for logged in user
 */
const getHome = (req, res) => {
    res.render('home', [
        {
            route: '/login',
            name: 'Login',
        },
        {
            route: '/signup',
            name: 'Signup',
        },
        {
            route: '/courses',
            name: 'Courses',
        },
    ]);
};

module.exports = { getHome };
