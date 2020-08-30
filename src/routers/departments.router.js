const express = require('express');
const departmentsController = require('../controllers/departments.controller');

const router = express.Router();

// /departments?lang={A|E}&fromDate={2018-01-01}&toDate={2020-12-31}&dateFormat={YYYY-MM-DDTHH:mm:ss}&flat={true|false} => GET
router.get('/', departmentsController.getAllDepartments);

// /departments/{id}?lang=A => GET
router.get('/:id', departmentsController.getDepartmentById);

// /departments/{id}/childs?lang=A => GET
router.get('/:id/childs', departmentsController.getChildDepartments);

// /departments/{id}/employees?lang=A => GET
router.get('/:id/employees', departmentsController.getDepartmentEmployees);

module.exports = router;