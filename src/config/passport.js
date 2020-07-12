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
