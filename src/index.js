//Packeges
const express = require('express');
const chalk = require('chalk');

//Middlewares
const { queryMiddleware } = require('@abujude/sgs-khadamati');
const authMiddleware = require('./middlewares/auth.middleware');

//Routers
const countriesRouter = require('./routers/countries.router');
const employeesRouter = require('./routers/employees.router');
const departmentsRouter = require('./routers/departments.router');
const vacationsRouter = require('./routers/vacations.router');
const attachmentsRouter = require('./routers/attachments.router');
const delegationsRouter = require('./routers/delegations.router');


//Controllers
const errorsController = require('./controllers/errors.controller');

//Express server
const app = express();

app.use(express.json());

app.use(queryMiddleware.setLanguage('A', 'lang'));

app.use((req, res, next) => {

    // req.query.lang = req.query.lang.toUpperCase() || 'A';

    next();

});

// app.use(authMiddleware);

app.use('/delegations', delegationsRouter);
app.use('/countries', countriesRouter);
app.use('/employees', authMiddleware, employeesRouter);
app.use('/departments', authMiddleware, departmentsRouter); 
app.use('/vacations', authMiddleware, vacationsRouter);
app.use('/attachments', attachmentsRouter);
app.use('/500', errorsController.get500);
app.use(errorsController.get404);

//This middleware will be called directly whene ever we call next(Error)
app.use((error, req, res, next) => {
    error.httpStatusCode = error.httpStatusCode || 500;
    error.message = error.httpStatusCode !== 404 ? 
        error.message || '' : 'Data NotFound!';
    return res.status(error.httpStatusCode).json({ error : error.message, data: error.errorsData || {} });
});

const port = process.env.PORT || 6000;

app.listen(port, () => {
    switch(process.env.SERVER_TYPE)
    {
        case 'DEVELOPMENT':
            console.log(chalk.yellowBright
                .inverse(`SGS KHADAMATI SAP ${process.env.SERVER_TYPE} SERVER IS UP AND RUNNING ON PORT ${port}`));
            break;
        case 'QUALITY':
            console.log(chalk.cyan
                .inverse(`SGS KHADAMATI SAP ${process.env.SERVER_TYPE} SERVER IS UP AND RUNNING ON PORT ${port}`));
            break;
        default :
             console.log(chalk.greenBright
                .inverse(`SGS KHADAMATI SAP ${process.env.SERVER_TYPE} SERVER IS UP AND RUNNING ON PORT ${port}`));
    }
});
