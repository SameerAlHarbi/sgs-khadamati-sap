const express = require('express');
const delegationsController = require('../controllers/delegations.controller');
const projectsController = require('../controllers/projects.controller');

const { queryMiddleware } = require('@abujude/sgs-khadamati');

const Router = express.Router();

// /delegations/types?{lang=A} => GET
Router.get('/types', delegationsController.getTypes);

// /delegations/projects => POST body {"code": "000011",
//                                              "year": "2022",
//                                              "createdBy": "917",
//                                              "managerId": "1143",
//                                              "title": "Test Add Project from Node.js",
//                                              "note": "Test",
//                                              "isActive": "true"}
Router.post('/projects'
    , projectsController.saveProject);

// /delegations/calc-amount => POST body {
//                                         "date": "2022-03-15",
//                                         "employeeId": "917",
//                                         "startDate": "2022-03-19",
//                                         "endDate": "2022-03-22",
//                                         "countryCode": "SA",
//                                         "dateFormat": "yyyy-MM-dd"
//                                         "note": "Test"
//                                          ...}
//
Router.post('/calc-amount'
    , queryMiddleware.parseDate(['date','startDate', 'endDate'], 'dateFormat', true, false, true)
    , delegationsController.calcAmount);

module.exports = Router;