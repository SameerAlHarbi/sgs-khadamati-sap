const express = require('express');
const delegationsController = require('../controllers/delegations.controller');

const Router = express.Router();

// /delegations/delegationsTypes?{lang=A} => GET
Router.get('/types', delegationsController.getDelegationTypes);

module.exports = Router;