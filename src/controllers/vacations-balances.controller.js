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
                , fromDate
                , toDate
                , vacationsTypes
                , lang);
        
        res.json(results);

    } catch (error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }

}

exports.getAllVacationsBalancesSummaries = async (req, res, next) => {

    const {employeesIds
            , vacationsTypes
            , balanceDate
            , lang} = req.query.lang;

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
