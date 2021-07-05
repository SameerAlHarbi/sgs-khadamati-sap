const employeesManager = require('../managers/employees.manager');


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
        error.httpStatusCode = error.httpStatusCode || 500;
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

exports.getEmployeeSubordinates = async (req, res, next) => {

    const employeeId = req.params.employeeId;
    const {fromDate, toDate, direct, tree, status,lang} = req.query;

    try {

        if(isNaN(employeeId))
        {
            const error = new Error('Invalid Employee id!');
            error.httpStatusCode = 400;
            throw error;
        }

        const results = await employeesManager
            .getEmployeeSubordinates(employeeId, fromDate, toDate, direct, tree, status, lang);

        if(!results) {
            const error = new Error();
            error.httpStatusCode = 404;
            throw error;
        }

        res.json(results);

    } catch(error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
}