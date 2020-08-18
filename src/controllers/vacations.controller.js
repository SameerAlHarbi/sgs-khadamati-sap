const vacationsManager = require('../managers/vacations.managers');
const dateUtil = require('../util/date');

exports.getAllVacations = async (req, res) => {

    const lang = req.query.lang;
    const employeesIds = req.query.employeesIds;
    const fromDateText = req.query.fromDate;
    const toDateText = req.query.toDate;
    const registerDateText = req.query.registerDate;
    const dateFormatText = req.query.dateFormat || dateUtil.defaultApiDateFormatText;
    const vacationsTypesIds = req.query.vacationsTypesIds;

    const fromDateObject = dateUtil.parseDate(fromDateText, dateFormatText);
    const toDateObject = dateUtil.parseDate(toDateText, dateFormatText);
    const registerDateObject = dateUtil.parseDate(registerDateText, dateFormatText);

    const employeesIdsCollection = employeesIds ? employeesIds.split(',') : [];
    const vacationsTypesIdsCollection = vacationsTypesIds ? vacationsTypesIds.split(',') : [];

    try {


        console.log('ok');

        const results = await vacationsManager
            .getAllVacations(
                employeesIdsCollection, 
                fromDateObject, 
                toDateObject,
                registerDateObject,
                vacationsTypesIdsCollection, 
                lang);

        res.send(results);

    } catch(e) {
        
        res.status(500).send();
    }

}

validateEmployeeVacationRequest = async (employeeVacation, dateFormatText) => {

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
        const startDateObject = dateUtil.parseDate(employeeVacation.startDate, dateFormatText);
        const endDateObject = dateUtil.parseDate(employeeVacation.endDate, dateFormatText);

        if(!startDateObject) {
            validationMessage = 'Invalid vacation start date!';
        } else if(!endDateObject || endDateObject < startDateObject) {
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

exports.validateEmployeeVacation = async (req, res) => {

    try {
        const employeeVacation = req.body;

        let validationResult = await validateEmployeeVacationRequest(employeeVacation, 
            req.query.dateFormat || dateUtil.defaultApiCompiledDateFormat);

            delete validationResult.badRequest;

        res.status(validationResult.badRequest ? 400 : 200)
            .send(validationResult);
    } catch(e) {
        res.status(500).send();
    }
}

exports.createEmployeeVacation = async (req, res) => {
    try {
        const employeeVacation = req.body;

        let validationResult = await validateEmployeeVacationRequest(employeeVacation, 
            req.query.dateFormat || dateUtil.defaultApiCompiledDateFormat);

        if(!validationResult.result) {
            delete validationResult.badRequest;
            return res.status(400).send(validationResult);
        }

        const creationResult = await vacationsManager
            .createEmployeeVacation(employeeVacation);

        res.send(creationResult);
    } catch(e) {
        res.status(500).send();
    }
}
