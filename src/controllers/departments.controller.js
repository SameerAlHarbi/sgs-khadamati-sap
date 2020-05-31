const departmentsManager = require('../managers/departments.manager');
const employeesManager = require('../managers/employees.manager');
const date = require('../util/date');


exports.getAllDepartments = async (req, res, next) => {
   
    const lang = req.query.lang;
    const fromDateText = req.query.fromDate;
    const toDateText = req.query.toDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;
    const flatData = req.query.flat;

    const fromDateObject = date.parseDate(fromDateText, dateFormatText);
    const toDateObject = date.parseDate(toDateText, dateFormatText);

    try {
        const results = await departmentsManager.getAllDepartments(fromDateObject, toDateObject, lang, flatData);
        res.send(results);
    } catch (e) {
        res.status(500).send();
    }
}

exports.getDepartmentById = async (req, res, next) => {

    const departmentId = req.params.id;
    const lang = req.query.lang;
    const fromDateText = req.query.fromDate;
    const toDateText = req.query.toDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;
    const childDepth = isNaN(req.query.childDepth) ? -1 : +req.query.childDepth;

    const fromDateObject = date.parseDate(fromDateText, dateFormatText);
    const toDateObject = date.parseDate(toDateText, dateFormatText);

    try {

        if(!departmentId) {
            res.status(400).send({ error: 'Invalid department id!'});
        }

        const result = await departmentsManager.getDepartmentById(departmentId, fromDateObject, toDateObject, lang, childDepth);

        if(result) {
            return res.send(result);
        }

        res.status(404).send();
    } catch(e) {
        res.status(500).send();
    }
}

exports.getChildDepartments = async (req, res, next) => {
    
    const departmentId = req.params.id;
    const lang = req.query.lang;
    const fromDateText = req.query.fromDate;
    const toDateText = req.query.toDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;
    const childDepth = isNaN(req.query.childDepth)  ? -1 : +req.query.childDepth;
    const flatData = req.query.flat;

    const fromDateObject = date.parseDate(fromDateText, dateFormatText);
    const toDateObject = date.parseDate(toDateText, dateFormatText);

    try {

        const results = await departmentsManager.getChildDepartments(departmentId, fromDateObject, toDateObject, lang, childDepth, flatData);
        res.send(results);

    } catch(e) {
        res.status(500).send();
    }
}

exports.getDepartmentEmployees = async (req, res, next) => {

    const departmentId = req.params.id;
    const lang = req.query.lang;
    const fromDateText = req.query.fromDate;
    const toDateText = req.query.toDate;
    const dateFormatText = req.query.dateFormat || date.defaultApiDateFormatText;

    const fromDateObject = date.parseDate(fromDateText, dateFormatText);
    const toDateObject = date.parseDate(toDateText, dateFormatText);

    try {

        const result = await employeesManager.getAllDepartmentEmployees(departmentId,
             fromDateObject,
             toDateObject,
             lang);

        res.send(result);

    } catch (e) {
        res.status(500).send();
    }
}