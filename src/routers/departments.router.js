const express = require('express');
const departmentsController = require('../controllers/departments.controller');
const { queryMiddleware } = require('@abujude/sgs-khadamati');

const Router = express.Router();

// /departments?{?fromDate}&{?toDate}&{?dateFormat=YYYY-MM-DDTHH:mm:ss}&{?flat=true|false}&{?lang=A|E} => GET
Router.get('/'
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat', true)
    , queryMiddleware.parseBoolean(['flat'], false)
    , departmentsController.getAllDepartments);

// /departments/{departmentId}?{fromDate}&{toDate}&{dateFormat=YYYY-MM-DDTHH:mm:ss}&{childDepth=-1|0|...}&{lang} => GET
Router.get('/:departmentId'
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat', true)
    , departmentsController.getDepartmentById);

// /departments/{departmentId}/childs?{fromDate}&{toDate}&{dateFormat}&{flat=true|false}&{childDepth=-1|0|...}&{lang} => GET
Router.get('/:departmentId/childs'
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat')
    , queryMiddleware.parseBoolean(['flat'], false)
    , departmentsController.getChildDepartments);

// /departments/{departmentId}/manager?{?fromDate}&{?toDate}&{?dateFormat=YYYY-MM-DDTHH:mm:ss}&{?lang=A|E} => GET
Router.get('/:departmentId/manager'
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat')
    , departmentsController.getDepartmentManager);

// /departments/{departmentId}/employees?{?fromDate}&{?toDate}&{?dateFormat=YYYY-MM-DDTHH:mm:ss}&{?direct}&{?tree}&{status=all|active|inactive|date}&{?lang=A|E} => GET
Router.get('/:departmentId/employees'
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat')
    , queryMiddleware.parseBoolean(['direct', 'tree'], false)
    , departmentsController.getDepartmentEmployees);

module.exports = Router;