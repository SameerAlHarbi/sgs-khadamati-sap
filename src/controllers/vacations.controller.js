const vacationsManager = require('../managers/vacations.managers');
const date = require('../util/date');

exports.getAllVacations = async (req, res) => {

    const lang = req.query.lang;
    const employeesIds = req.query.employeesIds;
    const fromDateText = req.query.fromDate;
    const toDateText = req.query.toDate;
    const registerDateText = req.query.registerDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;
    const vacationsTypesIds = req.query.vacationsTypesIds;

    const fromDateObject = date.parseDate(fromDateText, dateFormatText);
    const toDateObject = date.parseDate(toDateText, dateFormatText);
    const registerDateObject = date.parseDate(registerDateText, dateFormatText);

    const employeesIdsCollection = employeesIds ? employeesIds.split(',') : [];
    const vacationsTypesIdsCollection = vacationsTypesIds ? vacationsTypesIds.split(',') : [];

    try {
        const results = await vacationsManager
            .getAllEmployeesVacations(employeesIdsCollection, 
                fromDateObject, 
                toDateObject,
                registerDateObject,
                vacationsTypesIdsCollection, 
                lang);
        res.send(results);
    } catch(e) {
        console.log(e)
        res.status(500).send();
    }

}

validateEmployeeVacationRequest = (employeeVacation, dateFormatText) => {

    let validationMessage = '';

    const startDateObject = date.parseDate(employeeVacation.startDate, dateFormatText);
    const endDateObject = date.parseDate(employeeVacation.endDate, dateFormatText);

    if(!employeeVacation) {
        validationMessage = 'Invalid employee vacation!';
    } else if (isNaN(employeeVacation.employeeId)) {
        validationMessage = 'Invalid employee id!';
    } else if(!employeeVacation.vacationTypeId) {
        validationMessage = 'Invalid vacation type id!';
    } else if(!startDateObject) {
        validationMessage = 'Invalid vacation start date!';
    } else if(!endDateObject || endDateObject < startDateObject) {
        validationMessage = 'Invalid vacation end date!';
    } 

    return validationMessage;
}

exports.validateEmployeeVacation = async (req, res) => {

    try {

        const employeeVacation = req.body;

        let validationMessage = validateEmployeeVacationRequest(employeeVacation, 
            req.query.dateFormat || date.defaultApiCompiledDateFormat);

        if(validationMessage === '') {
            const result = await vacationsManager.validateEmployeeVacation(employeeVacation);
            console.log(result);
            res.send(result);
        } else {
            return res.status(400).send(validationMessage);
        }
    } catch(e) {
        console.log(e);
        res.status(500).send();
    }

}

exports.creat