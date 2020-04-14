const rfcPool = require('node-rfc').Pool;
const abapSystem = require('../util/abap-system');

const pool = new rfcPool(abapSystem);

module.exports = pool;