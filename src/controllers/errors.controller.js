exports.get404 = (req, res, next) => {
    const error = new Error();
    error.httpStatusCode = 404;
    return next(error);
}

exports.get500 = (req, res, next) => {
    const error = new Error('Sorry somthing went wrong! please try again later.' );
    error.httpStatusCode = 500
    return next(error);
}