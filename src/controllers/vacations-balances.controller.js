const vacationsBalancesManager = require('../managers/vacations-balances.manager');
const date = require('../util/date');

exports.getAllVacationsBalances = async (req, res) => {

    const lang = req.query.lang;
    const employeesIds = req.query.employeesIds;
    const fromDateText = req.query.fromDate;
    const toDateText = req.query.toDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;
    const vacationsTypesIds = req.query.vacationsTypesIds;

    const fromDateObject = date.parseDate(fromDateText, dateFormatText);
    const toDateObject = date.parseDate(toDateText, dateFormatText);

    const employeesIdsCollection = employeesIds ? employeesIds.split(',') : [];
    const vacationsTypesIdsCollection = vacationsTypesIds ? vacationsTypesIds.split(',') : [];

    try {
        let results = await vacationsBalancesManager
            .getAllVacationsBalances(employeesIdsCollection,
                     fromDateObject,
                     toDateObject, 
                     vacationsTypesIdsCollection, 
                     lang);

        res.send(results);
    } catch (e) {
        res.status(500).send();
    }

}

exports.getAllVacationsBalancesSummaries = async (req, res) => {

    const lang = req.query.lang;
    const employeesIds = req.query.employeesIds;
    const balanceDateText = req.query.balanceDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;
    const vacationsTypesIds = req.query.vacationsTypesIds;

    const balanceDateObject = date.parseDate(balanceDateText, dateFormatText);

    const employeesIdsCollection = employeesIds ? employeesIds.split(',') : [];
    const vacationsTypesIdsCollection = vacationsTypesIds ? vacationsTypesIds.split(',') : [];

    try {
        let results = await vacationsBalancesManager
            .getAllVacationsBalancesSummaries(employeesIdsCollection,
                 balanceDateObject,
                 vacationsTypesIdsCollection,
                 lang);
                 
        res.send(results);
    } catch (e) {
        res.status(500).send();
    }

}
