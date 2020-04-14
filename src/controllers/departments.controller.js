const departmentsManager = require('../managers/departments.manager');

exports.getAllDepartments = async (req, res, next) => {
   
    const lang = req.query.lang;

    try {
           
        const results = await departmentsManager.getAllDepartments(lang);
        res.send(results);
    } catch (e) {
        res.status(500).send();
    }
}