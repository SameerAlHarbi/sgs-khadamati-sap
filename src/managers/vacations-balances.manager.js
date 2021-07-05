const sapPool = require('../util/sap-rfc');
const { dateUtil } = require('@abujude/sgs-khadamati');
const vacationsTypesManager = require('./vacations-types.manager');

exports.getAllVacationsBalances = async (employeesIds = []
     , vacationsTypesIds = []
     , fromDate = new Date()
     , toDate = new Date()
     , lang = 'A') => {

    lang = lang.toUpperCase();

    try {

        const sapClient = await sapPool.acquire();
        const sapResults = await sapClient.call('ZHR_FINGERPRINT_ABSENCE_QUOTAS', {
            IM_PERNR: employeesIds,
            IM_BEGDA: dateUtil.formatDate(fromDate, dateUtil.defaultSapCompiledFormat),
            IM_ENDDA: dateUtil.formatDate(toDate, dateUtil.defaultSapCompiledFormat),
            IM_LANGU: lang
        });

        if(!sapResults || !sapResults['T_QUOTAS']) {
            return [];
        }

        const resultBalances = sapResults['T_QUOTAS'].map(balance => (
            {
                id: balance.KTART,
                employeeId: +balance.PERNR,
                description: balance.KTEXT,
                startDate: balance.BEGDA && !balance.BEGDA.includes('9999') ? 
                         dateUtil.convertFormat(balance.BEGDA
                            , dateUtil.defaultSapCompiledFormat
                            , dateUtil.defaultCompiledFormat) : '',
                endDate: balance.ENDDA && !balance.ENDDA.includes('9999') ?
                         dateUtil.convertFormat(balance.ENDDA
                            , dateUtil.defaultSapCompiledFormat
                            , dateUtil.defaultCompiledFormat) : '',
                open: +balance.ANZHL,
                used: +balance.KVERB,
                current: +balance.DNZHL,
                vacationsTypesIds: sapResults['T_QUO_ABS'].filter(vt => vt.KTART === balance.KTART && vt.PERSG === balance.PERSG).map(vt => vt.SUBTY).join(',') || ''
            }
        ));

        return vacationsTypesIds.length > 0 ? resultBalances.filter(balance => 
            balance.vacationsTypesIds.split(',')
            .filter(vt => vacationsTypesIds.indexOf(vt) >= 0).length > 0) : resultBalances;

    } catch(error) {
        throw error;
    }
}

getBalancesSummaries = (balancesList) => {

    if(!balancesList || balancesList.length < 1) {
        return [];
    }

    const resultSummaries = [];

    balancesList.forEach(balance => {

        if(!resultSummaries.find(b => b.employeeId === balance.employeeId && b.id === balance.id)) {

            let totalOpenBalance = 0;
            let totalUsedBalance = 0;
            let totalCurrentBalance = 0;

            const balances = balancesList
                .filter(b => b.employeeId === balance.employeeId && b.id === balance.id);

            let startDates = [];
            let endDates = [];

            balances
                .forEach(b => {

                    if(b.startDate) {
                        startDates.push(dateUtil.parseDate(b.startDate, dateUtil.defaultCompiledFormat));
                    }

                    if(b.endDate) {
                        endDates.push(dateUtil.parseDate(b.endDate, dateUtil.defaultCompiledFormat));
                    }

                });

            balances.forEach(b => {
                    totalOpenBalance += b.open;
                    totalUsedBalance += b.used;
                    totalCurrentBalance += b.current;
            });

            let result = Object.assign({}, balance);
            result.startDate = startDates.length > 0 ? dateUtil.formatDate(new Date(Math.min.apply( null, startDates))) : '';
            result.endDate = endDates.length > 0 ? dateUtil.formatDate(new Date(Math.max.apply( null, endDates))) : '';
            result.open = totalOpenBalance;
            result.used = totalUsedBalance;
            result.current = totalCurrentBalance;

            resultSummaries.push(result);
        }
    });

    return resultSummaries;
}

exports.getAllVacationsBalancesSummaries = async (employeesIds = []
    , vacationsTypesIds = []
    , balanceDate = new Date()
    , lang = 'A') => {

        try {

            const vacationsBalances = await this.getAllVacationsBalances(employeesIds
                , vacationsTypesIds
                , balanceDate
                , balanceDate
                , lang);

                if(vacationsBalances.length < 1) {
                    return [];
                }

                employeesIds = [];
                vacationsTypesIds = [];

                vacationsBalances.forEach(balance => {
                    employeesIds.push(balance.employeeId);
                    vacationsTypesIds.push(...balance.vacationsTypesIds.split(','));
                });

                //Select distinct data
                employeesIds = [... new Set(employeesIds)];
                vacationsTypesIds = [... new Set(vacationsTypesIds)];

                const vacationsTypes = await vacationsTypesManager.getAllVacationsTypes('ALL', lang);
                const resultsSummary = [];

                employeesIds.forEach(employeeId => {
                    vacationsTypes.forEach(vacationType => {

                       const vacationTypeBalances = vacationsBalances
                            .filter(balance => balance.employeeId === employeeId 
                                && balance.vacationsTypesIds.includes(vacationType.id));

                        let totalOpenBalance = 0;
                        let totalUsedBalance = 0;
                        let totalCurrentBalance = 0; 
                        let balancesSummary = getBalancesSummaries(vacationTypeBalances);
                        
                        vacationTypeBalances.forEach(balance => {
                            totalOpenBalance += balance.open;
                            totalUsedBalance += balance.used;
                            totalCurrentBalance += balance.current;
                        });
                        

                        if(totalOpenBalance > 0) {
                            resultsSummary.push({
                                employeeId: employeeId,
                                vacationTypeId: vacationType.id,
                                vacationTypeName: vacationType.name,
                                open: totalOpenBalance,
                                used: totalUsedBalance,
                                current: totalCurrentBalance,
                                summaries: balancesSummary,
                                balances: vacationTypeBalances
                            });
                        }

                    });                
                })

              return resultsSummary;  

        } catch (error) {
            throw error;
        }
}