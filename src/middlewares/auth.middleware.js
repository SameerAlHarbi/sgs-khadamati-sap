const auth = async (req, res, next) => {

    try {

        //validate ...
        if(true) {
            req.user = { id: 917};
        } else {
            const error = new Error('Please authenticate.!');
            error.httpStatusCode = 401;
            return next(error);
        }

    } catch(error) {
        e.httpStatusCode = 500;
        return next(error);
    }

    next();
}

module.exports = auth;