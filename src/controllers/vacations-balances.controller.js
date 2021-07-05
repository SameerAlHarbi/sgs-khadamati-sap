const vacationsBalancesManager = require('../managers/vacations-balances.manager');

exports.getAllVacationsBalances = async (req, res, next) => {

    const { employeesIds
            , vacationsTypes
            , fromDate
            , toDate
            , lang } = req.query;

    try {

        const results = await vacationsBalancesManager
            .getAllVacationsBalances(employeesIds
                , vacationsTypes
                , fromDate
                , toDate
                , lang);
        
        res.json(results);

    } catch (error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }

}

exports.getAllVacationsBalancesSummaries = async (req, res, next) => {

    const { employeesIds
            , vacationsTypes
            , balanceDate
            , lang } = req.query;

    try {

        const results = await vacationsBalancesManager
            .getAllVacationsBalancesSummaries(employeesIds
                , vacationsTypes
                , balanceDate
                , lang);
                 
        res.json(results);

    } catch (error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }

}

exports.getEmployeeVacationsBalances = async (req, res, next) => {

    const employeeId = req.params.employeeId;
    const {vacationsTypes, fromDate, toDate, lang} = req.query;

    try{

        const results = await vacationsBalancesManager
            .getAllVacationsBalances(
                [employeeId]
                 , vacationsTypes
                 , fromDate
                 , toDate
                 , lang);

        return res.json(results);

    } catch(error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }

}

exports.getEmployeeVacationsBalancesSummaries = async (req, res, next) => {

    const employeeId = req.params.employeeId;
    const {vacationsTypes, balanceDate, lang} = req.query;

    try {

        const results = await vacationsBalancesManager
            .getAllVacationsBalancesSummaries(
                [employeeId]
                , vacationsTypes
                , balanceDate
                , lang);

        res.json(results);

    } catch(error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }

}
