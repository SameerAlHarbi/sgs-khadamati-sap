const sapPool = require('../util/sap-rfc');

exports.saveProject = async (project) => {

    try {
        
        const sapClient = await sapPool.acquire();
        
        const results = await sapClient.call('ZHR_MANDATE_PROJECTS',{ IM_PROJECT: {
            PCODE:  project.code,
            GJAHR:  project.year,
            USNAM:  project.createdBy,
            PERNR:  project.managerId,
            PNAME:  project.title,
            NOTE: !(project.note)? "" : project.note,
            STATUS: project.isActive === "true"? "X":"-" }});
        
        if(!results) {
            throw new Error("Can't create project! , error from SAP");
        }
        
        return true;

    } catch (error) {
        throw error;
    }
}
