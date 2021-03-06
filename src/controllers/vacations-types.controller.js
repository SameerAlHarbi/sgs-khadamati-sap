const vacationsTypesManager = require('../managers/vacations-types.manager');

exports.getAllVacationsTypes = async (req, res, next) => {

    const workSystem = req.query.workSystem;
    const lang = req.query.lang;

    try {

        const results = await vacationsTypesManager
            .getAllVacationsTypes(workSystem,lang);
        
        return res.json(results);

    } catch(error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);   
    }
}