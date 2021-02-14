const countriesManager = require('../managers/countries.managers');

exports.getAllCountries = async (req, res, next) => {
    
    const lang = req.query.lang;

    try {

        const results = await countriesManager
            .getAllCountries(lang);
        
        res.json(results);

    } catch (error) {
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getCountryByCode = async (req, res, next) => {

    const countryCode = req.params.countryCode;
    const lang = req.query.lang;

    try {   

        const result  = await countriesManager
            .getCountryByCode(countryCode, lang);

        if(!result) {
            const error = new Error();
            error.httpStatusCode = 404;
            throw error;
        }

        return res.json(result);
    
    } catch (error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }

}

exports.getAllCities = async (req, res, next) => {

    const countryCode = req.params.countryCode;
    const lang = req.query.lang;

    try {

        const results = await countriesManager
            .getAllCities(countryCode, lang);

        res.json(results);

    } catch (error) {
        error.httpStatusCode = 500;
        return next(error);
    }
}


exports.getCityByCode = async (req, res, next) => {

    const { countryCode, cityCode }  = req.params;
    const lang = req.query.lang;

    try {

        const result  = await countriesManager
            .getCityByCode(countryCode, cityCode, lang);

        if(!result) {
            const error = new Error();
            error.httpStatusCode = 404;
            throw error;
        }

        return res.json(result);

     } catch (error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
     }
}
