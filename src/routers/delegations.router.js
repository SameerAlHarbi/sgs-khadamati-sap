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
//                                         "employeeId": "917"
//                                       , "startDate": "2022-03-19"
//                                       , "endDate": "2022-03-22"
//                                       , "dateFormat": "yyyy-MM-dd"
//                                       , "type" : "Internal|External|Field|Domain|Other"
//                                       , "countryCode": "SA"
//                                       , "transportation" : "ByAir|ByLand"
//                                       , "role": "Technican|Driver"
//                                       , "costEndurance" : "Full|Spendings|Non"
//                                        }
//
Router.post('/calc-amount'
    , queryMiddleware
        .parseDate(['startDate', 'endDate']
        , 'dateFormat'
        , true, false, true)
    , queryMiddleware.parseNumberParams(['employeeId']
        , true, false, true, true, 1, 10000, 'non', true)
    , delegationsController.calcAmount);

module.exports = Router;