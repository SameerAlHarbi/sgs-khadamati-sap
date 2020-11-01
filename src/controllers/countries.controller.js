const countriesManager = require('../managers/countries.managers');

exports.getAllCountries = async (req, res, next) => {
    
    const lang = req.query.lang || 'A';

    try {

        const results = await countriesManager
            .getAllCountries(lang);
        
        res.json(results);

    } catch (e) {
        e.httpStatusCode = 500;
        return next(e);
    }
}

exports.getCountryByCode = async (req, res, next) => {

    const code = req.params.code;
    const lang = req.query.lang || 'A';

    try {   

        const result  = await countriesManager
            .getCountryByCode(code, lang);

        if(!result) {
            const error = new Error();
            error.httpStatusCode = 404;
            return next(error);
        }

        return res.json(result);
    
    } catch (e) {
        e.httpStatusCode = 500;
        return next(e);
    }

}

exports.getAllCities = async (req, res, next) => {

    const code = req.params.code;
    const lang = req.query.lang || 'A';

    try {

        const results = await countriesManager
            .getAllCities(code, lang);

        res.json(results);

    } catch (e) {
        e.httpStatusCode = 500;
        return next(e);
    }
}


exports.getCityByCode = async (req, res, next) => {

    const { code, cityCode }  = req.params;
    const lang = req.query.lang || 'A';

    try {

        const result  = await countriesManager
            .getCityByCode(code, cityCode, lang);

        if(!result) {
            const error = new Error();
            error.httpStatusCode = 404;
            return next(error);
        }

        return res.json(result);

     } catch (e) {
        e.httpStatusCode = 500;
        return next(e);
     }
}
