const express = require('express');
const employeesController = require('../controllers/employees.controller');
const {queryMiddleware} = require('@abujude/sgs-khadamati');

const router = express.Router();

// /employees?{employeesIds}&{fromDate}&{toDate}&{dateFormat}&{status=all|active|inactive|date}&lang=A => GET
router.get('/'
    , queryMiddleware.parseDate([ 'fromDate', 'toDate'], 'dateFormat')
    , employeesController.getAllEmployees);

// /employees/{employeeId}?lang=A => GET
router.get('/:employeeId', employeesController.getEmployeeById);

// /employees/{employeeId}/salary?lang=A => GET
router.get('/:employeeId/salary', employeesController.getEmployeeSalary);

// /employees/{employeeId}/manager?lang=A => GET
router.get('/:employeeId/manager', employeesController.getEmployeeManager);

// /employees/{employeeId}/vacations?lang=A => GET
router.get('/:employeeId/vacations', employeesController.getEmployeeVacations);

// /employees/{employeeId}/vacations/balances?lang=A => GET
router.get('/:employeeId/vacations/balances', employeesController.getEmployeeVacationsBalances);

// /employees/{employeeId}/vacations/balances/summary?lang=A => GET
router.get('/:employeeId/vacations/balances/summary', employeesController.getEmployeeVacationsBalancesSummaries);

module.exports = router;