const projectsManager = require('../managers/projects.manager');

exports.saveProject = async (req, res, next) => {
    
    try {

        const project = req.body;

        let validationResult = await validateSaveProject(project);

        if(!validationResult.result) {
            delete validationResult.badRequest;
            return res.status(400).json(validationResult);
        }

        const results = await projectsManager
            .saveProject(project);
        
        res.json(results);

    } catch (error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
}

validateSaveProject = async (project) => {

    let validationMessage = '';

    if(!project) {
        validationMessage = 'Invalid project!';
    } else if(!project.code) {
        validationMessage = 'Invalid project code!';
    } else if(!project.year) {
        validationMessage = 'Invalid project year!';
    } else if (!project.createdById) {
        validationMessage = 'Invalid  project created By!';
    } else if (!project.managerId) {
        validationMessage = 'Invalid  project manager Id!';
    } else if(!project.title) {
        validationMessage = 'Invalid project title!';
    } else if(!project.isActive) {
        validationMessage = 'Invalid project status!';
    }

    let badRequest = true;

    if(validationMessage === '' ) {
        badRequest = false;
    }

    return { message: validationMessage, badRequest, result : validationMessage === ''};
}