const sapPool = require('../util/sap-rfc');
const modelMapper = require('../models/model-mapper');

/**
 * Get a list of all countries in SAP system or single country by code.
 * @param {string} countryCode - Optional if you want a single country. 
 * @param {string} lang - Results language.
 */
exports.getAllCountries = async (countryCode, lang = 'A') => {

    lang = lang.toUpperCase();

    try {
        
        const sapClient = await sapPool.acquire();
        let results = await sapClient.call('Z_COUNTRY_NATIONALITY',{ IM_LANGU: lang });
        if(!results || !results['T_CONT_NATI']) {
            return countryCode ? undefined : [];
        }

        if(countryCode) {   
            let result = results['T_CONT_NATI'].find(c => c.LAND1.toLowerCase() === countryCode.toLowerCase());
            return result ? modelMapper.mapCountryDTO(result) : undefined;
        }
        return results['T_CONT_NATI'].map(result => modelMapper.mapCountryDTO(result));

    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Get a list of all cities in specified country by code.
 * @param {string} countryCode - Country code.
 * @param {string} cityCode - Optional if you want a single city by code.
 * @param {string} lang - Results language.
 */
exports.getAllCities = async (countryCode, cityCode, lang = 'A') => {

    if(!countryCode) {
        throw new Error('country code is required!');
    }

    countryCode = countryCode.toUpperCase();
    lang = lang.toUpperCase();

    try {
        const sapClient = await sapPool.acquire();
        let results = await sapClient.call('Z_CITY_NAMES',{ IM_LAND: countryCode, IM_LANGU: lang });

        if(!results || !results['T_CITY']) {
            return cityCode ? undefined : [];
        }

        if(cityCode) {
            let result = results['T_CITY'].find(c => c.CITYC.toLowerCase() === cityCode.toLowerCase());
            return result ? modelMapper.mapCityDTO(result) : undefined;
        }

        return results['T_CITY'].map( result => modelMapper.mapCityDTO(result));
    } catch (e) {
        throw new Error(e.message);
    }
}
