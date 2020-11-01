const sapPool = require('../util/sap-rfc');
const modelMapper = require('../models/model-mapper');
const Country = require('../models/country.model');
const City = require('../models/city.model');

/**
 * Get an array of all countries in SAP system.
 * @param {string} lang - Results language.
 * @return {Array<Country>} Array of Country objects.
 */
exports.getAllCountries = async (lang = 'A') => {

    lang = lang.toUpperCase();

    try {
        
        const sapClient = await sapPool.acquire();
        let results = await sapClient.call('Z_COUNTRY_NATIONALITY',{ IM_LANGU: lang });
        if(!results || !results['T_CONT_NATI']) {
            return [];
        }

        return results['T_CONT_NATI'].map(result => modelMapper.mapCountryDTO(result));

    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Get country object by country code.
 * @param {string} countryCode - Country code.
 * @param {string} lang - Results language.
 * @return {Country} - Country object.
 */
exports.getCountryByCode = async (countryCode, lang = 'A') => {

    if(!countryCode) {
        throw new Error('Country code is required!');
    }

    try {

        const results = await this.getAllCountries(lang);
        let result = results.find(c => c.code.toLowerCase() === countryCode.toLowerCase());
        return result;

    } catch(e) {
        throw new Error(e.message);
    }
}

/**
 * Get an array of all cities in specified country by code.
 * @param {string} countryCode - Country code.
 * @param {string} lang - Results language.
 * @return {Array<City>} - Array of City objects.
 */
exports.getAllCities = async (countryCode, lang = 'A') => {

    if(!countryCode) {
        throw new Error('Country code is required!');
    }

    countryCode = countryCode.toUpperCase();
    lang = lang.toUpperCase();

    try {
        
        const sapClient = await sapPool.acquire();
        let results = await sapClient.call('Z_CITY_NAMES',{ IM_LAND: countryCode, IM_LANGU: lang });
        if(!results || !results['T_CITY']) {
            return [];
        }

        return results['T_CITY'].map( result => modelMapper.mapCityDTO(result));

    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Get a city object by city code in country by country code.
 * @param {string} countryCode - Country code.
 * @param {string} cityCode - City code.
 * @param {string} lang - Results language.
 * @return {City} - City object.
 */
exports.getCityByCode = async (countryCode, cityCode, lang = 'A') => {

    if(!cityCode) {
        throw new Error('City code is required!');
    }

    try {

        const results = await this.getAllCities(countryCode, lang);
        let result = results.find(c => c.code.toLowerCase() === cityCode.toLowerCase());
        return result;

    } catch(e) {
        throw new Error(e.message);
    }

}
