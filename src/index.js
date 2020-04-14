const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');

const countriesRouter = require('./routers/countries.router');
const employeesRouter = require('./routers/employees.router');
const departmentsRouter = require('./routers/departments.router');

const errorController = require('./controllers/error.controller');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/countries', countriesRouter);
app.use('/employees', employeesRouter);
app.use('/departments', departmentsRouter);

app.use(errorController.get404);

app.listen(port, () => {
    console.log(chalk.green.inverse('Server in up on port ' + port));
});