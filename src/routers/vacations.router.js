const express = require('express');
const vacationsTypesController = require('../controllers/vacations-types.controller');
const vacationsBalancesController = require('../controllers/vacations-balances.controller');
const vacationsController = require('../controllers/vacations.controller');

const router = express.Router();

router.get('/', vacationsController.getAllVacations);
router.get('/types', vacationsTypesController.getAllVacationsTypes);
router.get('/balances', vacationsBalancesController.getAllVacationsBalances);
router.get('/balances/summary', vacationsBalancesController.getAllVacationsBalancesSummaries);
router.post('/validate', vacationsController.validateEmployeeVacation);
router.post('/create', vacationsController.createEmployeeVacation);

module.exports = router;