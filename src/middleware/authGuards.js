const strings = require('../lib/strings');

const isAdmin = (req, res, next) => {
    if (req.user.access < 3) {
        next(new Error(strings.ERR_UNAUTHORIZED));
    }
    next();
};

const auth = (req, res, next) => {
    if (!req.user) {
        next(new Error(strings.ERR_NOT_LOGGED));
    }
    next();
};

module.exports = { auth, isAdmin };
