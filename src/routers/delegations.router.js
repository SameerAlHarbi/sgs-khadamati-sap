const { queryMiddleware } = require('@abujude/sgs-khadamati');
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
//                                         "employeeId": 917
//                                       , "startDate": "2022-03-19"
//                                       , "endDate": "2022-03-22"
//                                       , "dateFormat": "yyyy-MM-dd"
//                                       , "type" : "Field|Internal|External|Domain|Other"
//                                       , "countryCode": "SA"
//                                       , "transportation" : "ByAir|ByLand|Other"
//                                       , "role": "Technican|Driver"
//                                       , "costEndurance" : "Full|Spendings|Non"
//                                        }
//
Router.post('/calc-amount'
    , queryMiddleware.parseNumberParams(['employeeId']
        , true, false, true, true, 1, 10000, 'non', true)
    , queryMiddleware
        .parseDate(['startDate', 'endDate']
        , 'dateFormat'
        , true, false, true)
    , queryMiddleware.validateEnums('type'
        , ['Field','Internal','External','Domain','Other']
        , true , 'Internal', true)
    , queryMiddleware.validateEnums('transportation'
        , ['ByAir', 'ByLand', 'Other']
        , true, 'ByAir', true)
    , queryMiddleware.validateEnums('role'
        , ['Technican', 'Driver']
        , true, 'Technican', true)
    , queryMiddleware.validateEnums('costEndurance'
        , ['Full', 'Spendings', 'Non']
        , true, 'Full', true)
    , (req, res, next) => {
        if(!req.body['startDate']){
            const error = new Error('startDate is required!');
            error.httpStatusCode = 400;
            return next(error)
        }
        if(!req.body['endDate']){
            const error = new Error('startDate is required!');
            error.httpStatusCode = 400;
            return next(error)
        }
        if(req.body['type'].toUpperCase() !== 'EXTERNAL') {

            if(!req.body['countryCode'])
            {
                req.body['countryCode'] = 'SA';
            } else if(req.body['countryCode'].toUpperCase() !== 'SA'){
                const error = new Error('countryCode is invalid!');
                error.httpStatusCode = 400;
                return next(error)
            }
        } else if(!req.body['countryCode'] || req.body['countryCode'].toUpperCase() === 'SA') {
            const error = new Error('countryCode is invalid!');
            error.httpStatusCode = 400;
            return next(error)
        }

        return next();
    }
    , delegationsController.calcAmount);

// /delegations/allocation?{employeeId}&{sapId} => GET
Router.get('/allocation', delegationsController.getAllocation);
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