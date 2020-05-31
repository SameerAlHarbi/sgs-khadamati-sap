const sapPool = require('../util/sap-rfc');
const modelMapper = require('../models/model-mapper');

exports.getAllCountries = async (code, lang) => {

    lang = lang ? lang.toUpperCase() : 'A';

    try {
        
        const client = await sapPool.acquire();
        let results = await client.call('Z_COUNTRY_NATIONALITY',{ IM_LANGU: lang });
        if(!results || !results['T_CONT_NATI']) {
            return code ? undefined : [];
        }

        if(code) {   
            let result = results['T_CONT_NATI'].find(c => c.LAND1.toLowerCase() === code.toLowerCase());
            return result ? modelMapper.mapCountryDTO(result) : undefined;
        }
        return results['T_CONT_NATI'].map( result => modelMapper.mapCountryDTO(result));

    } catch (e) {
        throw new Error(e.message);
    }
}

exports.getAllCities = async (countryCode, cityCode, lang) => {

    if(!countryCode) {
        throw new Error('country code is required!');
    }

    countryCode = countryCode.toUpperCase();
    lang = lang ? lang.toUpperCase() : 'A';

    try {
        const client = await sapPool.acquire();
        let results = await client.call('Z_CITY_NAMES',{ IM_LAND: countryCode, IM_LANGU: lang });

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
