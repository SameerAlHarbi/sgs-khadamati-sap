const departmentsManager = require('../managers/departments.manager');
const employeesManager = require('../managers/employees.manager');

exports.getAllDepartments = async (req, res, next) => {

    const { fromDate, toDate, flat , lang } = req.query;
    flat = flat ? req.query.flat === 'true' : false;

    try {

        const results = await departmentsManager
            .getAllDepartments(fromDate, toDate, flat, lang);
        res.json(results);

    } catch (error) {
        error.httpStatusCode = 500;
        return next(error);
    }

}

exports.getDepartmentById = async (req, res, next) => {

    const departmentId = req.params.departmentId;
    const { fromDate, toDate, childDepth, lang } = req.query;
    childDepth = isNaN(childDepth) ? -1 : +childDepth;

    try {

        if(isNaN(departmentId)) {
            const error = new Error('Invalid department id!');
            error.httpStatusCode = 400;
            throw error;
        }

        const result = await departmentsManager.getDepartmentById(departmentId
            , fromDate
            , toDate
            , childDepth
            , lang);

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

exports.getChildDepartments = async (req, res, next) => {
    
    const departmentId = req.params.departmentId;
    const { fromDate, toDate, flat, childDepth, lang } = req.query;
    flat = flat ? req.query.flat === 'true' : false;
    childDepth = isNaN(childDepth) ? -1 : +childDepth;

    try {

        if(isNaN(departmentId)) {
            const error = new Error('Invalid department id!');
            error.httpStatusCode = 400;
            throw error;
        }

        const results = await departmentsManager.getChildDepartments(departmentId
            , fromDate
            , toDate
            , flat
            , childDepth
            , lang);

        res.json(results);

    } catch(error) {
        error.httpStatusCode  = error.httpStatusCode || 500;
        return next(error);
    }

}

exports.getDepartmentEmployees = async (req, res, next) => {

    const departmentId = req.params.departmentId;
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

    } catch (error) {
        error.httpStatusCode  = 500;
        return next(error);
    }
}