const { queryMiddleware } = require('@abujude/sgs-khadamati');
const express = require('express');
const delegationsController = require('../controllers/delegations.controller');
const projectsController = require('../controllers/projects.controller');

const Router = express.Router();

// /delegations/Types?{lang=A} => GET
Router.get('/types', delegationsController.getDelegationTypes);

// /delegations/projects => POST body {"code": "000011",
//                                              "year": "2022",
//                                              "createdBy": "917",
//                                              "managerId": "1143",
//                                              "title": "Test Add Project from Node.js",
//                                              "note": "Test",
//                                              "isActive": "true"}
Router.post('/Projects'
    , projectsController.saveProject);

// /delegations/accomplished => POST body {"employeeId": 1143,
//                                         "sapId": "4000010007",
//                                         "startDate": "2022-03-01",
//                                         "endDate": "2022-03-03"}
Router.post('/accomplished'
    //, queryMiddleware.parseNumberParams(['employeeId']
    //        , true, false, true, true, 1, 10000, 'non', true)
    , queryMiddleware.parseDate(['startDate','endDate']
            , 'dateFormat'
            , true, false, true)
    , delegationsController.accomplished);

module.exports = Router;