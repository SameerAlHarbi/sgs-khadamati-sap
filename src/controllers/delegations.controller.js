const delegationsManager = require('../managers/delegations.manager');

exports.getTypes = async (req, res, next) => {
    
    const lang = req.query.lang;

    try {

        const results = await delegationsManager
            .getTypes(lang);
        
        res.json(results);

    } catch (error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
}

exports.calcAmount = async (req, res, next) => {
    
    const delegationRequest = req.body;

    try {

        const results = await delegationsManager
            .calcAmount(delegationRequest);
        
        res.json(results);

    } catch (error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
}