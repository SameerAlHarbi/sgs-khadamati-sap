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

exports.getAllocation = async (req, res, next) => {

    const {employeeId, sapId} = req.query;

    try {

        if(isNaN(employeeId) || !employeeId)
        {
            const error = new Error('Invalid Employee id!');
            error.httpStatusCode = 400;
            throw error;
        }
        if(!sapId)
        {
            const error = new Error('Invalid Sap id!');
            error.httpStatusCode = 400;
            throw error;
        }

        const result = await delegationsManager.getAllocation(employeeId, sapId);

        if(!result) {
            const error = new Error();
            error.httpStatusCode = 404;
            throw error;
        }

        res.json(result);
        
    } catch(error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
}