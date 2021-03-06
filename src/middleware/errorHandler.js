const errorHandler = (err, req, res, next) => {
    next(
        res.json({
            status: 'error',
            message: err.message,
        })
    );
};

module.exports = { errorHandler };
