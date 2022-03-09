const sapPool = require('../util/sap-rfc');

exports.addOrEditGeologicalProject = async (geologicalProject) => {

    try {
        const sapClient = await sapPool.acquire();
        const projectStructure = {
            PCODE: geologicalProject.projectCode,
            GJAHR: geologicalProject.projectYear,
            USNAM: geologicalProject.CreateProjectEmployeeId,
            PERNR: geologicalProject.projectManagerId,
            PNAME: geologicalProject.projectTitle,
            NOTE:  geologicalProject.projectNote,
            STATUS: geologicalProject.isActive === "true"? "X":"-"
        };
        const results = await sapClient.call('ZHR_MANDATE_PROJECTS',{IM_PROJECT:projectStructure});
        
        if(!results) {
            return false;
        }

        return true;

    } catch (error) {
        throw error;
    }
}