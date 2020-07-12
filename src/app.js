/**
 * Application start point, all code will be documented with explanation of what it does.
 */

/* List module dependencies */
const express = require('express');
const dotenv = require('dotenv');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const path = require('path');
const helmet = require('helmet');

const User = require('./models/User');
const passport = require('passport');
const auth = require('./middleware/auth');

/**
 * Create Express server.
 */
const app = express();

/* Define paths for Express config */
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

/* Configure dotenv path to load environment variables for API keys and passwords */
dotenv.config({ path: '.env' });

/* Setup port or rely on default */
app.set('port', process.env.PORT || 8080);

/* Connect to MongoDB */
require('./database/connection');

/* Setup static directory to serve */
app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet()); // Secure inspection
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

/* Homepage GET route */
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', (req, res) => {
    const formData = {
        email: req.body.email,
        password: req.body.password,
    };
    console.log(`E-mail: ${formData.email}\nPassword: ${formData.password}`);
    res.render('signup');
    // res.redirect('login');
});

/* Setup error handler */
if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler());
} else {
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send('Server Error');
    });
}
/* Start Express server */
app.listen(app.get('port'), () => {
    console.log(
        '%s App is running at http://localhost:%d in %s mode',
        chalk.green('✓'),
        app.get('port'),
        app.get('env')
    );
    console.log('Press CTRL-C to stop.\n');
});

module.exports = app;
