const employeesManager = require('../managers/employees-manager');
const date = require('../util/date');

exports.getAllEmployees = async (req, res, next) => {

    //extract query parametars data
    const lang = req.query.lang;
    const employeesIds = req.query.employeesIds;
    const fromDateText = req.query.fromDate;
    const toDateText = req.query.toDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;
    const status = req.query.status;

    const fromDateObject = date.parseDate(fromDateText, dateFormatText);
    const toDateObject = date.parseDate(toDateText, dateFormatText);

    const employeesIdsCollection = employeesIds ? employeesIds.split(',') : [];

    try {
        let results = await employeesManager.getAllEmployeesInfo(employeesIdsCollection, fromDateObject, toDateObject, status, lang);
        res.send(results);
    } catch (e) {
        res.status(500).send();
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
        const results = await employeesManager.getAllEmployeesInfo([employeeId], undefined, undefined, 'all', lang);

        if(results && results.length > 0) {
            return res.send(results[0]);
        }

        res.status(404).send();
    } catch(e) {
        res.status(500).send();
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
        console.log(e);
        res.status(500).send();
    }

}

exports.getAllDepartmentEmployees = async (req, res, next) => {

    const departmentCode = req.params.departmentCode;
    const lang = req.query.lang;
    const fromDateText = req.query.fromDate;
    const toDateText = req.query.toDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;

    const fromDateObject = date.parseDate(fromDateText, dateFormatText);
    const toDateObject = date.parseDate(toDateText, dateFormatText);

    try {

        const result = await employeesManager.getAllDepartmentEmployees(departmentCode,
             fromDateObject,
             toDateObject,
             lang);

        res.send(result);

    } catch (e) {
        res.status(500).send();
    }
}