const express = require('express');
const delegationsController = require('../controllers/delegations.controller');
const geologicalProjectsController = require('../controllers/geological-projects.controller');

const Router = express.Router();

// /delegations/Types?{lang=A} => GET
Router.get('/types', delegationsController.getDelegationTypes);

// /delegations/geologicalProject => POST body {"projectCode": "000011",
//                                              "projectYear": "2022",
//                                              "CreateProjectEmployeeId": "917",
//                                              "projectManagerId": "1143",
//                                              "projectTitle": "Test Add Project from Node.js",
//                                              "projectNote": "Test",
//                                              "isActive": "true"}
Router.post('/geologicalProject', geologicalProjectsController.addOrEditGeologicalProject);

module.exports = Router;