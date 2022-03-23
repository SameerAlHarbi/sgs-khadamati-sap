const delegationsManager = require('../managers/delegations.manager');

exports.getDelegationTypes = async (req, res, next) => {
    
    const lang = req.query.lang;

    try {

        const results = await delegationsManager
            .getDelegationTypes(lang);
        
        res.json(results);

    } catch (error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
}

exports.accomplished = async (req, res, next) => {
    
    try {

        const delegation = req.body;
        console.log(delegation);
        const results = await delegationsManager
            .accomplished(delegation);
        
        res.json(results);

    } catch (error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
}