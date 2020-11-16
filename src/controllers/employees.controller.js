const employeesManager = require('../managers/employees.manager');
const vacationsBalancesManager = require('../managers/vacations-balances.manager');
const vacationsManager = require('../managers/vacations.managers');
const date = require('../util/date');

exports.getAllEmployees = async (req, res, next) => {

    const { employeesIds, fromDate, toDate, status, lang} = req.query;

    try {
        
        let results = await employeesManager.getAllEmployees(employeesIds, 
            fromDate, 
            toDate, 
            status,
            lang);

        res.json(results);

    } catch (e) {
        e.httpStatusCode = 500;
        return next(e);
    }
}

exports.getEmployeeById = async (req, res, next) => {

    const employeeId = req.params.employeeId;
    const lang = req.query.lang;

    try {

        if(isNaN(employeeId))
        {
            return res.status(400).send({ error: 'Invalid Employee id!'});
        }
        
        const result = await employeesManager
            .getAllEmployeesInfo([employeeId], undefined, undefined, 'all', lang);

        if(!result) {
            const error = new Error();
            error.httpStatusCode = 404;
            return next(error);
        }

        res.json(result);

        // if(results && results.length > 0) {
        //     return res.send(results[0]);
        // }

    } catch(e) {
        e.httpStatusCode = 500;
        return next(e);
    }

}

exports.getEmployeeSalary = async (req, res, next) => {

    const employeeId = req.params.employeeId;
    const fromDateText = req.query.fromDate;
    const toDateText = req.query.toDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;

    const fromDateObject = date.parseDate(fromDateText, dateFormatText);
    const toDateObject = date.parseDate(toDateText, dateFormatText);

    try {

        const result = await employeesManager.getEmployeeSalaryInfo(employeeId, fromDateObject, toDateObject,);

        if(!result) {
           return res.status(404).send();
        }

        res.send(result);
    } catch(e) {
        res.status(500).send();
    }
}

exports.getEmployeeManager = async (req, res, next) => {

    const employeeId = req.params.employeeId;
    const lang = req.query.lang;
    const fromDateText = req.query.fromDate;
    const toDateText = req.query.toDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;

    const fromDateObject = date.parseDate(fromDateText, dateFormatText);
    const toDateObject = date.parseDate(toDateText, dateFormatText);

    try {

        const result = await employeesManager.getEmployeeManagerInfo(employeeId, fromDateObject, toDateObject, lang);

        if(!result) {
           return res.status(404).send();
        }

        res.send(result);

    } catch (e) {
        res.status(500).send();
    }

}

exports.getEmployeeVacationsBalances = async (req, res) => {

    const employeeId = req.params.employeeId;
    const lang = req.query.lang;
    const fromDateText = req.query.fromDate;
    const toDateText = req.query.toDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;
    const vacationsTypesIds = req.query.vacationsTypesIds;

    const fromDateObject = date.parseDate(fromDateText, dateFormatText);
    const toDateObject = date.parseDate(toDateText, dateFormatText);

    const vacationsTypesIdsCollection = vacationsTypesIds ? vacationsTypesIds.split(',') : [];

    try{
        const results = await vacationsBalancesManager
            .getAllVacationsBalances([employeeId],
                 fromDateObject, 
                 toDateObject, 
                 vacationsTypesIdsCollection, lang);
        return res.send(results);
    } catch(e) {
        res.status(500).send();
    }
}

exports.getEmployeeVacationsBalancesSummaries = async (req, res) => {

    const employeeId = req.params.employeeId;
    const lang = req.query.lang;
    const balanceDateText = req.query.balanceDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;
    const vacationsTypesIds = req.query.vacationsTypesIds;

    const balanceDateObject = date.parseDate(balanceDateText, dateFormatText);

    const vacationsTypesIdsCollection = vacationsTypesIds ? vacationsTypesIds.split(',') : [];

    try {

        const results = await vacationsBalancesManager
            .getAllVacationsBalancesSummaries([employeeId], balanceDateObject, vacationsTypesIdsCollection, lang);

        res.send(results);
    } catch(e) {
        res.status(500).send();
    }
}

exports.getEmployeeVacations = async (req, res) => {

    const employeeId = req.params.employeeId;
    const lang = req.query.lang;
    const fromDateText = req.query.fromDate;
    const toDateText = req.query.toDate;
    const registerDateText = req.query.registerDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;
    const vacationsTypesIds = req.query.vacationsTypesIds;

    const fromDateObject = date.parseDate(fromDateText, dateFormatText);
    const toDateObject = date.parseDate(toDateText, dateFormatText);
    const registerDateObject = date.parseDate(registerDateText, dateFormatText);

    const vacationsTypesIdsCollection = vacationsTypesIds ? vacationsTypesIds.split(',') : [];

    try {
        const results = await vacationsManager.getAllVacations([employeeId],
            fromDateObject, toDateObject, registerDateObject, vacationsTypesIdsCollection, lang);

        res.send(results);    
    } catch(e) {
        res.status(500).send();
    }
}