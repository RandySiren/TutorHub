const data = require('../routes/data').links;
/**
 * Render home page/dashboard for logged in user
 */
const getHome = (req, res) => {
    res.render('home', {
        data,
        menu: [
            {
                route: '/courses/add',
                name: 'Add a Course',
            },
            {
                route: '/courses/delete',
                name: 'Delete a Course',
            },
            {
                route: '/courses/view',
                name: 'View a Course',
            },
        ],
    });
};

module.exports = { getHome };
