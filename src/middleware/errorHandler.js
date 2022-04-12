const errorHandler = (err, req, res, next) => {
    // Redirect to front-end if OAuth flow error
    if (err.message === 'OAUTH_ERR_EXISTING_USER') {
        res.redirect(302, '/auth');
    }

    next(
        res.json({
            status: 'error',
            message: err.message,
        })
    );
};

module.exports = { errorHandler };
