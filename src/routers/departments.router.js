const express = require('express');
const departmentsController = require('../controllers/departments.controller');
const { queryMiddleware } = require('@abujude/sgs-khadamati');

const Router = express.Router();

// /departments?{fromDate}&{toDate}&{?dateFormat=YYYY-MM-DDTHH:mm:ss}&{?flat=true|false}&{?lang=A|E} => GET
Router.get('/'
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat')
    , departmentsController.getAllDepartments);

// /departments/{departmentId}?{fromDate}&{toDate}&{dateFormat=YYYY-MM-DDTHH:mm:ss}&{childDepth=-1|0|...}&{lang} => GET
Router.get('/:departmentId'
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat')
    , departmentsController.getDepartmentById);

// /departments/{departmentId}/childs?{fromDate}&{toDate}&{dateFormat}&{flat=true|false}&{childDepth=-1|0|...}&{lang} => GET
Router.get('/:departmentId/childs'
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat')
    , departmentsController.getChildDepartments);

// /departments/{departmentId}/employees?lang=A => GET
Router.get('/:departmentId/employees'
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat')
    , departmentsController.getDepartmentEmployees);

module.exports = Router;