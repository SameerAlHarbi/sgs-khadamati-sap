const express = require('express');
const errorsControllers = require('../controllers/errors.controller');

const Router = express.Router();

Router.get('/500', errorsController.get500);

Router.use(errorsController.get404);

module.exports = Router;


