//Packeges
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');

//Middlewares
const authMiddleware = require('./middlewares/auth.middleware');

//Routers
const countriesRouter = require('./routers/countries.router');
const employeesRouter = require('./routers/employees.router');
const departmentsRouter = require('./routers/departments.router');
const vacationsRouter = require('./routers/vacations.router');
const errorController = require('./controllers/error.controller');

//Express server
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use('/countries', authMiddleware, countriesRouter);
app.use('/employees', authMiddleware, employeesRouter);
app.use('/departments', authMiddleware, departmentsRouter); 
app.use('/vacations', authMiddleware, vacationsRouter);

app.use('/500', errorController.get500);
app.use(errorController.get404);

//This middleware will be called directly whene ever we call next(Error)
app.use((error, req, res, next) => {
    error.httpStatusCode = error.httpStatusCode || 500;
    error.message = error.httpStatusCode !== 404 ? 
        error.message || '' : 'Data NotFound!';
    return res.status(error.httpStatusCode).json({ error : error.message });
});

const port = process.env.PORT || 6000;
app.listen(port, () => {
    console.log(chalk.greenBright
        .inverse(`SGS KHADAMATI SAP SERVER IS UP AND RUNNING ON PORT ${port}`));
});