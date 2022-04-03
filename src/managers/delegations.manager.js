const sapPool = require('../util/sap-rfc');
const modelMapper = require('../models/model-mapper');
const delegationType = require('../models/delegationType.model');

/**
 * Get an array of all delegationsTypes in SAP system.
 * @param {string} lang - Results language.
 * @return {Array<delegationType>} Array of delegationsTypes objects.
 */
 exports.getDelegationTypes = async (lang = 'A') => {

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

/**
 * Get an array of all delegationsTypes in SAP system.
 * @param {string} employeeId -  Employee Id.
 * @param {string} sapId -  Sap Request Id.
 * @return {Array<allocation>} Array of Allocation objects.
 */
 exports.getAllocation = async (employeeId, sapId) => {

    try {

        if(isNaN(employeeId) || !sapId )
        {
            throw new Error('Invalid data!');
        }
        
        const sapClient = await sapPool.acquire();
        const results = await sapClient.call('ZHR_MANDATE_EARMARKED_CHECK',{ IM_PERNR: employeeId ,                                                              IM_MADNO: sapId });
        if(!results || !results['EX_EARMARKED']) {
            return [];
        }
    
        return modelMapper.mapAllocationDTO(results['EX_EARMARKED']);

    } catch (error) {
        if(error.key === 'NO_EARMARKED_DOCUMENT')
        {
            return  undefined;
        }
        throw error;
    }
}