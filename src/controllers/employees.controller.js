const employeesManager = require('../managers/employees.manager');
// const vacationsBalancesManager = require('../managers/vacations-balances.manager');
// const vacationsManager = require('../managers/vacations.managers');

exports.getAllEmployees = async (req, res, next) => {

    const { employeesIds, fromDate, toDate, status, lang } = req.query;

    try {
        
        const results = await employeesManager.getAllEmployees(employeesIds, 
            fromDate, 
            toDate, 
            status,
            lang);

        res.json(results);

    } catch (error) {
        error.httpStatusCode = 500;
        return next(error);
    }

}

exports.getEmployeeById = async (req, res, next) => {

    const employeeId = req.params.employeeId;
    const lang = req.query.lang;

    try {

        if(isNaN(employeeId))
        {
            const error = new Error('Invalid Employee id!');
            error.httpStatusCode = 400;
            throw error;
        }
        
        const result = await employeesManager.getEmployeeById(employeeId, lang);

        if(!result) {
            const error = new Error();
            error.httpStatusCode = 404;
            throw error;
        }

        res.json(result);
        
    } catch(error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
}

exports.getEmployeeSalary = async (req, res, next) => {

    const employeeId = req.params.employeeId;
    const { fromDate, toDate } = req.query;

    try {

        if(isNaN(employeeId))
        {
            const error = new Error('Invalid Employee id!');
            error.httpStatusCode = 400;
            throw error;
        }

        const result = await employeesManager
            .getEmployeeSalary(employeeId, fromDate, toDate,);

        if(!result) {
            const error = new Error();
            error.httpStatusCode = 404;
            throw error;
        }

        res.json(result);

    } catch(error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
}

exports.getEmployeeManager = async (req, res, next) => {

    const employeeId = req.params.employeeId;
    const {fromDate, toDate, lang} = req.query;

    try {

        if(isNaN(employeeId))
        {
            const error = new Error('Invalid Employee id!');
            error.httpStatusCode = 400;
            throw error;
        }

        const result = await employeesManager
            .getEmployeeManager(employeeId, fromDate, toDate, lang);

        if(!result) {
            const error = new Error();
            error.httpStatusCode = 404;
            throw error;
        }

        res.json(result);

    } catch (error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
    
}

// exports.getEmployeeVacationsBalances = async (req, res) => {

//     const employeeId = req.params.employeeId;
//     const lang = req.query.lang;
//     const fromDateText = req.query.fromDate;
//     const toDateText = req.query.toDate;
//     const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;
//     const vacationsTypesIds = req.query.vacationsTypesIds;

//     const fromDateObject = date.parseDate(fromDateText, dateFormatText);
//     const toDateObject = date.parseDate(toDateText, dateFormatText);

//     const vacationsTypesIdsCollection = vacationsTypesIds ? vacationsTypesIds.split(',') : [];

//     try{
//         const results = await vacationsBalancesManager
//             .getAllVacationsBalances([employeeId],
//                  fromDateObject, 
//                  toDateObject, 
//                  vacationsTypesIdsCollection, lang);
//         return res.send(results);
//     } catch(e) {
//         res.status(500).send();
//     }
// }

// exports.getEmployeeVacationsBalancesSummaries = async (req, res) => {

//     const employeeId = req.params.employeeId;
//     const lang = req.query.lang;
//     const balanceDateText = req.query.balanceDate;
//     const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;
//     const vacationsTypesIds = req.query.vacationsTypesIds;

//     const balanceDateObject = date.parseDate(balanceDateText, dateFormatText);

//     const vacationsTypesIdsCollection = vacationsTypesIds ? vacationsTypesIds.split(',') : [];

//     try {

//         const results = await vacationsBalancesManager
//             .getAllVacationsBalancesSummaries([employeeId], balanceDateObject, vacationsTypesIdsCollection, lang);

//         res.send(results);
//     } catch(e) {
//         res.status(500).send();
//     }
// }

// exports.getEmployeeVacations = async (req, res) => {

//     const employeeId = req.params.employeeId;
//     const lang = req.query.lang;
//     const fromDateText = req.query.fromDate;
//     const toDateText = req.query.toDate;
//     const registerDateText = req.query.registerDate;
//     const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;
//     const vacationsTypesIds = req.query.vacationsTypesIds;

//     const fromDateObject = date.parseDate(fromDateText, dateFormatText);
//     const toDateObject = date.parseDate(toDateText, dateFormatText);
//     const registerDateObject = date.parseDate(registerDateText, dateFormatText);

//     const vacationsTypesIdsCollection = vacationsTypesIds ? vacationsTypesIds.split(',') : [];

//     try {
//         const results = await vacationsManager.getAllVacations([employeeId],
//             fromDateObject, toDateObject, registerDateObject, vacationsTypesIdsCollection, lang);

//         res.send(results);    
//     } catch(e) {
//         res.status(500).send();
//     }
// }