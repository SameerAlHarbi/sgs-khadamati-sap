const express = require('express');
const employeesController = require('../controllers/employees.controller');

const router = express.Router();

router.get('/', employeesController.getAllEmployees);

router.get('/departments/:departmentCode', employeesController.getAllDepartmentEmployees);

router.get('/:employeeId', employeesController.getEmployeeById);
router.get('/:employeeId/salary', employeesController.getEmployeeSalary);
router.get('/:employeeId/manager', employeesController.getEmployeeManager);


module.exports = router;