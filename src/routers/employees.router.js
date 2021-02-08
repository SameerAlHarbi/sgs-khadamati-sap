const express = require('express');
const employeesController = require('../controllers/employees.controller');
const { queryMiddleware } = require('@abujude/sgs-khadamati');

const Router = express.Router();

// /employees?{employeesIds}&{fromDate}&{toDate}&{dateFormat}&{status=all|active|inactive|date}&{lang=A} => GET
Router.get('/'
    , queryMiddleware.split(['employeesIds'])
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat')
    , employeesController.getAllEmployees);

// /employees/{employeeId}?lang=A => GET
Router.get('/:employeeId', employeesController.getEmployeeById);

// /employees/{employeeId}/salary?{fromDate}&{toDate}&{dateFormat}&{lang=A} => GET
Router.get('/:employeeId/salary'
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat')
    , employeesController.getEmployeeSalary);

// /employees/{employeeId}/manager?{fromDate}&{toDate}&{dateFormat}&{lang=A} => GET
Router.get('/:employeeId/manager'
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat')
    , employeesController.getEmployeeManager);

// // /employees/{employeeId}/vacations?lang=A => GET
// Router.get('/:employeeId/vacations', employeesController.getEmployeeVacations);

// // /employees/{employeeId}/vacations/balances?lang=A => GET
// Router.get('/:employeeId/vacations/balances', employeesController.getEmployeeVacationsBalances);

// // /employees/{employeeId}/vacations/balances/summary?lang=A => GET
// Router.get('/:employeeId/vacations/balances/summary', employeesController.getEmployeeVacationsBalancesSummaries);

module.exports = Router;