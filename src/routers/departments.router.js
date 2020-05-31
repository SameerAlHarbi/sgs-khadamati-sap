const express = require('express');

const departmentsController = require('../controllers/departments.controller');

const router = express.Router();

router.get('/', departmentsController.getAllDepartments);
router.get('/:id', departmentsController.getDepartmentById);
router.get('/:id/childs', departmentsController.getChildDepartments);
router.get('/:id/employees', departmentsController.getDepartmentEmployees);

module.exports = router;