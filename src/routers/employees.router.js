const express = require('express');
const employeesController = require('../controllers/employees.controller');
const vacationsBalancesController = require('../controllers/vacations-balances.controller');
const vacationsController = require('../controllers/vacations.controller');
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

// /employees/{employeeId}/subordinates?{fromDate}&{toDate}&{dateFormat}&{?direct}&{?tree}&{dateFormat}&{status=all|active|inactive|date}&{lang=A} => GET
Router.get('/:employeeId/subordinates'
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat')
    , queryMiddleware.parseBoolean(['direct', 'tree'], false)
    , employeesController.getEmployeeSubordinates);

// /employees/{employeeId}/vacations?{vacationsTypes}&{registerDate}&{fromDate}&{toDate}&{dateFormat}&{lang=A} => GET
Router.get('/:employeeId/vacations'
    , queryMiddleware.split(['vacationsTypes'])
    , queryMiddleware.parseDate(['registerDate', 'fromDate', 'toDate'], 'dateFormat')  
    , vacationsController.getEmployeeVacations);

// /employees/{employeeId}/vacations/balances?{vacationsTypes}&{fromDate}&{toDate}&{dateFormat}&{lang=A} => GET
Router.get('/:employeeId/vacations/balances'
    , queryMiddleware.split(['vacationsTypes'])
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat') 
    , vacationsBalancesController.getEmployeeVacationsBalances);

// /employees/{employeeId}/vacations/balances/summary?{vacationsTypes}&{balanceDate}&{dateFormat}&{lang=A} => GET
Router.get('/:employeeId/vacations/balances/summary'
    , queryMiddleware.split(['vacationsTypes'])
    , queryMiddleware.parseDate(['balanceDate'], 'dateFormat')
    , vacationsBalancesController.getEmployeeVacationsBalancesSummaries);

module.exports = Router;