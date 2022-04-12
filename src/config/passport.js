const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const User = mongoose.model('user');
const strings = require('../lib/strings');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (data, done) => {
    const user = await User.findById(data._id);
    done(null, user);
});

passport.use(
    new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email });
                if (user && !user.verified)
                    done(new Error(strings.ERR_UNVERIFIED_USER));
                else if (
                    !user ||
                    (user.password && !user.validPassword(password))
                )
                    done(new Error(strings.ERR_WRONG_CREDENTIALS));
                else if (user && (user.googleId || user.facebookId))
                    done(new Error(strings.ERR_WRONG_CREDENTIALS));
                else return done(null, user);
            } catch (e) {
                return done(e);
            }
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/login/google/callback',
        },
        async (accesToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (user) {
                    if (
                        user.email != profile.emails[0].value ||
                        user.pic != profile.photos[0].value
                    ) {
                        user.email = profile.emails[0].value;
                        user.pic = profile.photos[0].value;
                        user.save();
                    }
                    return done(null, user);
                } else {
                    user = await User.findOne({
                        email: profile.emails[0].value,
                    });
                    if (user) {
                        user.googleId = profile.id;
                        user.pic = profile.photos[0].value;
                        user.save();
                        return done(null, user);
                    }
                    const newUser = await new User({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        pic: profile.photos[0].value,
                        verified: true,
                    }).save();
                    return done(null, newUser);
                }
            } catch (e) {
                return done(e);
            }
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: '/api/login/facebook/callback',
            profileFields: ['id', 'displayName', 'photos', 'email'],
        },
        async (accesToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ facebookId: profile.id });
                if (user) {
                    if (
                        user.email != profile.emails[0].value ||
                        user.pic != profile.photos[0].value
                    ) {
                        user.email = profile.emails[0].value;
                        user.pic = profile.photos[0].value;
                        user.save();
                    }
                    return done(null, user);
                } else {
                    user = await User.findOne({
                        email: profile.emails[0].value,
                    });
                    if (user) {
                        user.facebookId = profile.id;
                        user.pic = profile.photos[0].value;
                        user.save();
                        return done(null, user);
                    }
                    const newUser = await new User({
                        facebookId: profile.id,
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        pic: profile.photos[0].value,
                        verified: true,
                    }).save();
                    return done(null, newUser);
                }
            } catch (e) {
                return done(e);
            }
        }
    )
);
