/*
Code Artifact: Passport
Passport is an authentication middleware for Node.js. We are using passport to authenticate login.
Written By Mandeep Sran on July 16th 2020
Approved by team and reviewed by Joseph Power on July 17th 2020.
This module uses:
User - The current user that has made a connection to the website.
passport.use() - This method will take a user input for username / password, hash the password and search up the user:password combo in the database. 
               -  message: 'Invalid email or password.', standard output for invalid email address or incorrect password. 
               - 3 Alternative branches for successful login:
                - If the user/password combination was succesful, log the user in and navigate to homepage.
                - If the login was successful and the user is a tutor, load tutor modules and navigate to homepage
                - If the login was successful and the user is an administrator, load administrator modules and navigate homepage.

This module accesses the Mongo Database locally through the passport package, for security reasons we do not connect the user to the database directly. 
This module only has output for unsuccessful login - "Invalid email or password."
Sample test data can be found in sample.txt, the list of users in each permission level we used to test authentication. 
*/

const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const { User } = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            /* Search for same email user from database */
            await User.findOne(
                { email: email.toLowerCase() },
                async (err, user) => {
                    if (err) return done(err);
                    /* If cannot find email, return false with error message */
                    if (!user)
                        return done(null, false, {
                            message: 'Invalid email or password.',
                        });
                    /* If found, compare hashed password */
                    await user.comparePassword(password, (err, same) => {
                        if (err) return done(err);
                        if (same) return done(null, user);
                        return done(null, false, {
                            message: 'Invalid email or password.',
                        });
                    });
                }
            );
        }
    )
);

/* If the user is not logged in, we kick them out! */
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
};

/* Checks if user is a tutor */
exports.isTutor = (req, res, next) => {
    if (req.user.clearance >= 2) return next();
    res.redirect('/');
};

/* Checks if user is an admin */
exports.isAdmin = (req, res, next) => {
    if (req.user.clearance === 3) return next();
    res.redirect('/');
};
