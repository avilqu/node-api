const strings = require('../lib/strings');

const authGuards = {
    logged: (req, res, next) => {
        if (!req.user) {
            next(new Error(strings.ERR_NOT_LOGGED));
        }
        next();
    },
    isUser: (req, res, next) => {},
};

const auth = (req, res, next) => {
    if (!req.user) {
        next(new Error(strings.ERR_NOT_LOGGED));
    }
    next();
};

module.exports = { auth };
