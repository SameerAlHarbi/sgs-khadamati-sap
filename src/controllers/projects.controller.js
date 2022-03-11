const projectsManager = require('../managers/projects.manager');

exports.saveProject = async (req, res, next) => {
    
    try {

        const project = req.body;

        let validationResult = await validateProject(project);

        if(!validationResult.result) {
            const error = new Error(validationResult.validationMessage);
            error.httpStatusCode = 400;
            delete validationResult.badRequest;
            error.errorsData = validationResult;
            throw error;
        }

        const results = await projectsManager
            .saveProject(project);
        
        res.json(results);

    } catch (error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }
}

validateProject = async (project) => {

    let validationMessage = '';
    let propertyName = ''

    if(!project) {
        validationMessage = 'Invalid project!';
    } else if(!project.code) {
        propertyName = 'code';
        validationMessage = 'Invalid project code!';
    } else if(!project.year
        || !Number.isInteger(+project.year)
        || +project.year < 2018
        || +project.year > new Date().getFullYear()) {
        propertyName = 'year';
        validationMessage = 'Invalid project year!';
    } else if (!project.createdBy
        || !Number.isInteger(+project.createdBy)
        || +project.createdBy < 1
        || +project.createdBy > 10000) {
        propertyName = 'createdBy';
        validationMessage = 'Invalid  project created By!';
    } else if (!project.managerId
        || !Number.isInteger(+project.managerId)
        || +project.managerId < 1
        || +project.managerId > 10000) {
        propertyName = 'managerId';
        validationMessage = 'Invalid  project manager Id!';
    } else if(!project.title) {
        propertyName = 'title';
        validationMessage = 'Invalid project title!';
    } else if(!project.isActive) {
        propertyName = 'isActive';
        validationMessage = 'Invalid project status!';
    }

    let badRequest = true;

    if(validationMessage === '' ) {
        badRequest = false;
    }

    return { message: validationMessage
        , badRequest
        , propertyName 
        , result : validationMessage === ''};
}