const express = require('express');
const router = express.Router();
const passport = require('passport');

const loginRoute = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(
            strategy,
            { failureRedirect: '/login' },
            (err, user) => {
                if (err) return next(err);
                req.login(user, (err) => {
                    if (err) return next(err);
                    else if (strategy == 'local')
                        res.json({ status: 'success', data: { user } });
                    else {
                        res.redirect(302, '/auth');
                    }
                });
            }
        )(req, res, next);
    };
};

router.get(
    '/login/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

router.get(
    '/login/facebook',
    passport.authenticate('facebook', {
        scope: ['email'],
    })
);

router.get('/logout', (req, res) => {
    req.logout();
    res.json({ status: 'success' });
});

router.post('/login', loginRoute('local'));
router.get('/login/google/callback', loginRoute('google'));
router.get('/login/facebook/callback', loginRoute('facebook'));

module.exports = router;
