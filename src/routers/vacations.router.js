const express = require('express');

const vacationsTypesController = require('../controllers/vacations-types.controller');
const vacationsBalancesController = require('../controllers/vacations-balances.controller');
const vacationsController = require('../controllers/vacations.controller');

const { queryMiddleware } = require('@abujude/sgs-khadamati');

const Router = express.Router();

// /vacations?{employeesIds}&{vacationsTypes}&{fromDate}&{toDate}&{registerDate}&{dateFormat}&{workSystem=all|sgs|pbs}&{lang=A} => GET
Router.get('/'
    , queryMiddleware.split(['employeesIds','vacationsTypes'])
    , queryMiddleware.parseDate(['fromDate', 'toDate', 'registerDate'], 'dateFormat')
    , vacationsController.getAllVacations);

// /vacations/types?{workSystem=all|sgs|pbs}&{lang=A} => GET
Router.get('/types'
    , vacationsTypesController.getAllVacationsTypes);
 
Router.get('/balances'
    , queryMiddleware.split(['employeesIds','vacationsTypes'])
    , queryMiddleware.parseDate(['fromDate', 'toDate'], 'dateFormat')
    , vacationsBalancesController.getAllVacationsBalances);

Router.get('/balances/summary'
    , queryMiddleware.split(['employeesIds','vacationsTypes'])
    , queryMiddleware.parseDate(['balanceDate'], 'dateFormat')
    , vacationsBalancesController.getAllVacationsBalancesSummaries);

Router.post('/validate-new'
    , queryMiddleware.parseDate(['startDate', 'endDate'], 'dateFormat', true, false, true)
    , vacationsController.validateEmployeeVacation);

// Router.post('/create'
//     , vacationsController.createEmployeeVacation);

module.exports = Router;