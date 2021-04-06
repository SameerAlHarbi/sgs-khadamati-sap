const sapPool = require('../util/sap-rfc');

exports.attach = async ( employeeId
        , fromDate
        , toDate, sequence, requestNumber) => {

    try {

        const sapClient = await sapPool.acquire();

        const sapParams = { 
            IM_ATTA_KEY: {
                PERNR: employeeId
              , SUBTY: '    '
              , ENDDA: fromDate
              , BEGDA: toDate
              , SEQNR: sequence
              , INFTY: '3323'
              , REQST: requestNumber
              , DATUM: fromDate
              , UZEIT: fromDate
              , UNAME: employeeId
            },
            IM_ATTA_DATA: {

            }
          };

        const results = await sapClient.call('ZHR_SAVE_MANDATE_ATTA', sapParams);

        if(!results || !results['T_CONT_NATI']) {
            return [];
        }

        return results['T_CONT_NATI'].map(result => modelMapper.mapCountryDTO(result));

    } catch (error) {
        throw error;
    }
}