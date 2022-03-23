const sapPool = require('../util/sap-rfc');
const modelMapper = require('../models/model-mapper');
const delegationType = require('../models/delegationType.model');
const { dateUtil } = require('@abujude/sgs-khadamati');

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

exports.accomplished = async (delegation) => {

    try {
        
        const sapClient = await sapPool.acquire();
        
        const results = await sapClient.call('ZHR_MANDATE_ADMITTING',{ 
            IM_PERNR: delegation.employeeId,
            IM_APPNUM: delegation.sapId,
            IM_BEGDA: dateUtil.formatDate(delegation.startDate , dateUtil.defaultSapCompiledFormat),
            IM_ENDDA: dateUtil.formatDate(delegation.endDate , dateUtil.defaultSapCompiledFormat),
            IM_ADMIT: "X"});
            
        if(!results) {
            throw new Error("can't add accomplished in SAP! , error from SAP");
        }
        
        if(results['EX_SUBRC'] === 0){
            return true;
        }
    
    } catch (error) {
        if(error.key === "NO_DATA_FOUND"){
            return false;
        }
        throw error;
    }
}