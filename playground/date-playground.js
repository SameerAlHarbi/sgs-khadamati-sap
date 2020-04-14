console.log('ok');

const date = require('../src/util/date');

let result = date.parseDate('2019-02-10', 'YYYY-MM-DD');

console.log(result);

let result2 = date.formatDate(result);
