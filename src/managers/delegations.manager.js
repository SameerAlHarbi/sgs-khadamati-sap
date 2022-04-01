const { dateUtil } = require('@abujude/sgs-khadamati');
const sapPool = require('../util/sap-rfc');
const modelMapper = require('../models/model-mapper');
const delegationType = require('../models/delegationType.model');

/**
 * Get an array of all delegationsTypes in SAP system.
 * @param {string} lang - Results language.
 * @return {Array<delegationType>} Array of delegationsTypes objects.
 */
 exports.getTypes = async (lang = 'A') => {

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

const getSapType = (delegationType) => {
    switch(delegationType.toUpperCase()) {
        case 'FIELD':
            return 'A';
        case 'INTERNAL':
            return 'B';
        case 'EXTERNAL':
            return 'C';
        case 'DOMAIN':
            return 'D';
        default:
            return 'E';
      }
}

const getSapTransportation = (transportation) => {
    switch(transportation.toUpperCase()) {
        case 'BYAIR':
            return 'A';
        case 'BYLAND':
            return 'B';
        default:
            return 'C';
    }
}

const getSapRole = (role) => role.toUpperCase()
    === 'Technican'.toUpperCase() ? 'G' : 'D';

exports.calcAmount = async (delegationRequest) => {

    try {

        const sapParams = { 
            IM_PERNR: delegationRequest.employeeId.toString()
          , IM_BEGDA: dateUtil.formatDate(delegationRequest.startDate
            , dateUtil.defaultSapCompiledFormat)
          , IM_ENDDA: dateUtil.formatDate(delegationRequest.endDate
            , dateUtil.defaultSapCompiledFormat)
          , IM_DAYS: dateUtil.calcDaysDuration(delegationRequest.startDate
            , delegationRequest.endDate).toString()
          , IM_TYPE: getSapType(delegationRequest.type)
          , IM_TRAVEL: getSapTransportation(delegationRequest.transportation)
          , IM_LAND1: delegationRequest.countryCode
          , IM_FOOD: delegationRequest.costEndurance.toUpperCase() === 'NON' ? 'X': ' '
          , IM_HOUSE: delegationRequest.costEndurance.toUpperCase() !== 'FULL' ? 'X': ' '
          , IM_ESGROUP: '3'
        };

        if(delegationRequest.type.toUpperCase() === 'DOMAIN') {
            sapParams.IM_EMPCAT = getSapRole(delegationRequest.role);
        }

        const sapClient = await sapPool.acquire();
        const results = await sapClient.call('ZHR_MANDATE_PAYMENT_CALCULATE', sapParams);

        if(!results || !results['T_MANDATE_PAY'] || results['T_MANDATE_PAY'].length < 1) {
            return undefined;
        }

        return +results['T_MANDATE_PAY'].pop().BETRG;
    } catch (error) {
        throw error;
    }
}
