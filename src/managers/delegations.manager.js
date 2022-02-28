const sapPool = require('../util/sap-rfc');
const modelMapper = require('../models/model-mapper');
const delegationType = require('../models/delegationType.model');

/**
 * Get an array of all delegationsTypes in SAP system.
 * @param {string} lang - Results language.
 * @return {Array<delegationType>} Array of delegationsTypes objects.
 */
 exports.getDelegationsTypes = async (lang = 'A') => {

    lang = lang.toUpperCase();

    try {
        
        const sapClient = await sapPool.acquire();
        const results = await sapClient.call('ZHR_MANDATE_VALUES',{ IM_LANGU: lang });
        if(!results || !results['T_TYPE']) {
            return [];
        }

        return results['T_TYPE'].map(result => modelMapper.mapDelegationTypeDTO(result));

    } catch (error) {
        throw error;
    }
}
