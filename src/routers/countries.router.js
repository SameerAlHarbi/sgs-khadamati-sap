const express = require('express');
const countriesController = require('../controllers/countries.controller');

const Router = express.Router();

// /countries?lang=A => GET
Router.get('/', countriesController.getAllCountries);

// /countries/{code}?lang=A => GET
Router.get('/:code', countriesController.getCountryByCode);

// /countries/{code}/cities?lang=A => GET
Router.get('/:code/cities', countriesController.getAllCities);

// /countries/{code}/cities/{cityCode}?lang=A => GET
Router.get('/:code/cities/:cityCode', countriesController.getCityByCode);

module.exports = Router;