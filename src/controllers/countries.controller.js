const countriesManager = require('../managers/countries.managers');

exports.getAllCountries = async (req, res, next) => {
    
    const lang = req.query.lang;

    try {
        let results = await countriesManager.getAllCountries(undefined, lang)
        res.send(results);
    } catch (e) {
        console.log(e);
        res.status(500).send();
    }
}

exports.getCountryByCode = async (req, res, next) => {

        const code = req.params.code
        const lang = req.query.lang;
    
        try {   
            const result  = await countriesManager.getAllCountries(code, lang);
            if(result) {
               return res.send(result);
            }
            res.status(404).send();
     
         } catch (e) {
             res.status(500).send();
         }
}

exports.getAllCities = async (req, res, next) => {

    code = req.params.code;
    const lang = req.query.lang;;

    try {
        let results = await countriesManager.getAllCities(code, undefined, lang)
        res.send(results);
    } catch (e) {
        res.status(500).send();
    }
}


exports.getCityByCode = async (req, res, next) => {

    const { code, cityCode }  = req.params;
    const lang = req.query.lang;;

    try {
        let result  = await countriesManager.getAllCities(code, cityCode, lang);
        if(result) {
           return res.send(result);
        }
        res.status(404).send();
 
     } catch (e) {
         res.status(500).send();
     }
}


