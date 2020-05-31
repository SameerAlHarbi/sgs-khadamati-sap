const vacationsTypesManager = require('../managers/vacations-types.manager');

exports.getAllVacationsTypes = async (req, res) => {

    const lang = req.query.lang;
    const workSystem = req.query.workSystem;

    try{
        let results = await vacationsTypesManager.getAllVacationsTypes(workSystem,lang);
        return res.send(results);
    } catch(e) {
        res.status(500).send();
    }
}