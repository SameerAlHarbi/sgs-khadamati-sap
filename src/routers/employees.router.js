const express = require('express');
const employeesController = require('../controllers/employees.controller');

const router = express.Router();

router.get('/', employeesController.getAllEmployees);

router.get('/:employeeId', employeesController.getEmployeeById);
router.get('/:employeeId/salary', employeesController.getEmployeeSalary);
router.get('/:employeeId/manager', employeesController.getEmployeeManager);
router.get('/:employeeId/vacations', employeesController.getEmployeeVacations);
router.get('/:employeeId/vacations/balances', employeesController.getEmployeeVacationsBalances);
router.get('/:employeeId/vacations/balances/summary', employeesController.getEmployeeVacationsBalancesSummaries);

module.exports = router;