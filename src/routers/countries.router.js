const express = require('express');
const countriesController = require('../controllers/countries.controller');

const Router = express.Router();

// /countries?{lang=A} => GET
Router.get('/', countriesController.getAllCountries);

// /countries/{countryCode}?{lang=A} => GET
Router.get('/:countryCode', countriesController.getCountryByCode);

// /countries/{countryCode}/cities?{lang=A} => GET
Router.get('/:countryCode/cities', countriesController.getAllCities);

// /countries/{countryCode}/cities/{cityCode}?{lang=A} => GET
Router.get('/:countryCode/cities/:cityCode', countriesController.getCityByCode);

module.exports = Router;