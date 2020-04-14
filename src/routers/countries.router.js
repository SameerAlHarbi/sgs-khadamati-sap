const express = require('express');
const countriesController = require('../controllers/countries.controller');

const router = express.Router();

// /countries?lang=A => GET
router.get('/', countriesController.getAllCountries);

// /countries/{code}?lang=A => GET
router.get('/:code', countriesController.getCountryByCode);

// /countries/{code}/cities?lang=A => GET
router.get('/:code/cities', countriesController.getAllCities);

// /countries/{code}/cities/{cityCode}?lang=A => GET
router.get('/:code/cities/:cityCode', countriesController.getCityByCode);

module.exports = router;