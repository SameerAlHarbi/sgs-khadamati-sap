const sapPool = require('../util/sap-rfc');
const vacationsTypesManager = require('./vacations-types.manager');
const vacationsBalancesManager = require('./vacations-balances.manager');
const date = require('../util/date');
const helpers = require('../util/helpers');
const { dateUtil } = require('@abujude/sgs-khadamati');

const parseVacations = (sapVacations, infoType) => {

    if(!sapVacations || sapVacations.length < 1) {
        return [];
    }

    const resultsVacations = sapVacations
        .map(vacation => ({
            id: +vacation.DOCNR,
            employeeId: +vacation.PERNR,
            vacationTypeId: vacation.SUBTY,
            vacationTypeName: vacation.ATEXT,
            startDate: dateUtil.convertFormat(vacation.BEGDA
                , dateUtil.defaultSapTextFormat
                , dateUtil.defaultTextFormat),
            endDate: dateUtil.convertFormat(vacation.ENDDA
                , dateUtil.defaultSapTextFormat
                , dateUtil.defaultTextFormat),  
            registerDate: dateUtil.convertFormat(vacation.AEDTM
                , dateUtil.defaultSapTextFormat
                , dateUtil.defaultTextFormat),
            duration: dateUtil.calcDaysDuration(dateUtil.parseDate(vacation.BEGDA, dateUtil.defaultSapTextFormat)
                , dateUtil.parseDate(vacation.ENDDA, dateUtil.defaultSapTextFormat)),
            infoType: infoType
        })
    );

    return resultsVacations;
}

exports.getAllVacations = async (employeesIds = [],
    fromDate = null,
    toDate = null,
    registerDate = null, 
    vacationsTypesIds = [],
    lang = 'A') => {

        lang = lang.toUpperCase();

        try {

            let sapParams = { 
                IM_PERNR: employeesIds,
                IM_LANGU: lang
              };

            if(fromDate) {
                sapParams.IM_BEGDA = dateUtil.formatDate(fromDate, dateUtil.defaultSapCompiledFormat);
            }

            if(toDate) {
                sapParams.IM_ENDDA = dateUtil.formatDate(toDate, dateUtil.defaultSapCompiledFormat);
            }

            if(registerDate) {
                sapParams.IM_CDATE = dateUtil.formatDate(registerDate, dateUtil.defaultSapCompiledFormat);
                sapParams.IM_UPDATE = 'X';
            }

            const sapClient = await sapPool.acquire();
            const sapResults = await sapClient.call('ZHR_FINGERPRINT_VACATIONS', sapParams);
    
            if(!sapResults || !sapResults['T_2001']) {
                return [];
            }

            let resultsVacations = parseVacations(sapResults['T_2001'], 2001);
            
            if(vacationsTypesIds.length > 0) {
                resultsVacations = resultsVacations.filter(vacation => vacationsTypesIds.find(v => v === vacation.vacationTypeId));
            }

            return resultsVacations.sort(helpers.compareValues('startDate'));

        } catch (error) {
            throw error;
        }
};

exports.validateEmployeeVacation = async (employeeVacation) => {

    try {
        const startDate = date.convertFormat(employeeVacation.startDate, date.defaultApiCompiledDateFormat,date.defaultSapCompiledDateFormat);
        const endDate = date.convertFormat(employeeVacation.endDate, date.defaultApiCompiledDateFormat,date.defaultSapCompiledDateFormat);

        const client = await sapPool.acquire();
        const sapResults = await client.call('ZHR_ABSENCE_SIMULATECREATION', {
            EMPLOYEENUMBER: employeeVacation.employeeId.toString(),
            ABSENCETYPE: employeeVacation.vacationTypeId,
            VALIDITYBEGIN: startDate,
            VALIDITYEND: endDate
        });

        const validationMessage = !sapResults || !sapResults['RETURN'] ?
        'Validation Error!' : sapResults['RETURN'].MESSAGE;

        return { validationMessage , validationResult: validationMessage === ''};
        
    } catch(e) {
        throw new Error(e.message);
    }
};

exports.createEmployeeVacation = async (employeeVacation) => {

    try {

        const startDate = date.convertFormat(employeeVacation.startDate, date.defaultApiCompiledDateFormat,date.defaultSapCompiledDateFormat);
        const endDate = date.convertFormat(employeeVacation.endDate, date.defaultApiCompiledDateFormat,date.defaultSapCompiledDateFormat);

        const client = await sapPool.acquire();
        const sapResults = await client.call('ZHR_ABSENCE_CREATE', {
            EMPLOYEENUMBER: employeeVacation.employeeId.toString(),
            ABSENCETYPE: employeeVacation.vacationTypeId,
            VALIDITYBEGIN: startDate,
            VALIDITYEND: endDate
        });

        if(!sapResults || !sapResults['RETURN']) {
            return { result : false, message: 'Creation error', id: 0, number: 0 }
        }

        return {
            result: sapResults['RETURN'].TYPE === 'S',
            message: sapResults['RETURN'].MESSAGE,
            id: sapResults['RETURN'].ID,
            number: sapResults['RETURN'].NUMBER
        }
    } catch(e) {
        console.log(e)
        throw new Error(e.message);
    }
}
