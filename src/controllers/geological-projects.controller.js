const geologicalProjectsManager = require('../managers/geological-projects.manager');

exports.addOrEditGeologicalProject = async (req, res, next) => {
    
    const geologicalProject = req.body;

    try {

        const results = await geologicalProjectsManager
            .addOrEditGeologicalProject(geologicalProject);
        
        res.json(results);

    } catch (error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
}