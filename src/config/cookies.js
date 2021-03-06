const cookieSession = require('cookie-session');

const keys = [
    process.env.COOKIE_KEY_1,
    process.env.COOKIE_KEY_2,
    process.env.COOKIE_KEY_3,
];

module.exports = {
    cookieSession: cookieSession({
        name: 'auth',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 1 month
        keys: keys,
        httpOnly: false,
    }),
};
