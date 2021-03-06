const strings = require('../lib/strings');

const errorHandler = (err, req, res, next) => {
    let message;
    if (err.errors) {
        if (err.errors.password) message = strings.ERR_INVALID_PASSWORD;
        if (err.errors.email) message = strings.ERR_INVALID_EMAIL;
        if (err.errors.name) message = strings.ERR_INVALID_NAME;
    } else message = err.message;

    res.json({
        status: 'error',
        message: message,
    });
};

module.exports = { errorHandler };
