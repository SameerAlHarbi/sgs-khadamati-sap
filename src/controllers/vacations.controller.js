const vacationsManager = require('../managers/vacations.managers');

const { dateUtil } = require('@abujude/sgs-khadamati');

exports.getAllVacations = async (req, res, next) => {

    const { employeesIds
            , vacationsTypes
            , fromDate
            , toDate
            , registerDate
            , workSystem
            , lang } = req.query;

    try {

        const results = await vacationsManager
            .getAllVacations( employeesIds
                , vacationsTypes
                , fromDate
                , toDate
                , registerDate
                , workSystem
                , lang );

        res.json(results);

    } catch(error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);  
    }

}

exports.getEmployeeVacations = async (req, res, next) => {

    const employeeId = req.params.employeeId;
    const { vacationsTypes
            , fromDate
            , toDate
            , registerDate
            , lang} = req.query;

    try {

        const results = await vacationsManager.getAllVacations(
             [employeeId]
            , vacationsTypes 
            , fromDate
            , toDate
            , registerDate
            , 'all'
            , lang);

        res.json(results);  

    } catch(error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
}

validateEmployeeVacationRequest = async (employeeVacation) => {

    let validationMessage = '';

    if(!employeeVacation) {
        validationMessage = 'Invalid vacation!';
    } else if(!employeeVacation.startDate) {
        validationMessage = 'Invalid vacation start date!';
    } else if(!employeeVacation.endDate) {
        validationMessage = 'Invalid vacation end date!';
    } else if (isNaN(employeeVacation.employeeId)) {
        validationMessage = 'Invalid employee id!';
    } else if(!employeeVacation.vacationTypeId || employeeVacation.vacationTypeId.trim() === "") {
        validationMessage = 'Invalid vacation type id!';
    }

    if (validationMessage === '') {
        if(employeeVacation.endDate < employeeVacation.startDate) {
            validationMessage = 'Invalid vacation end date!';
        } 
    }

    let badRequest = true;

    if(validationMessage === '' ) {
        badRequest = false;
        const result = await 
            vacationsManager.validateEmployeeVacation(employeeVacation);
        
        validationMessage = result.validationMessage;
    }

    return { message: validationMessage, badRequest, result : validationMessage === ''};
}

exports.validateEmployeeVacation = async (req, res, next) => {

    try {
        const employeeVacation = req.body;

        let validationResult = await validateEmployeeVacationRequest(employeeVacation);

        const isBadRequest = validationResult.badRequest;
        delete validationResult.badRequest;

        res.status(validationResult.badRequest ? 400 : 200)
            .json(validationResult);

    } catch(error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
}

exports.createEmployeeVacation = async (req, res, next) => {

    try {

        const employeeVacation = req.body;

        let validationResult = await validateEmployeeVacationRequest(employeeVacation);

        if(!validationResult.result) {
            delete validationResult.badRequest;
            return res.status(400).json(validationResult);
        }

        const creationResult = await vacationsManager
            .createEmployeeVacation(employeeVacation);

        res.json(creationResult);
    } catch(error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }

}
