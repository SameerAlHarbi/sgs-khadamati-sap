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


// /delegations/allocation?{employeeId}&{sapId} => GET
Router.get('/allocation', delegationsController.getAllocation);

module.exports = Router;