const sapPool = require('../util/sap-rfc');
const date = require('../util/date');

exports.getAllDepartments = async (fromDate = new Date(), toDate = new Date(), lang = 'ِA', flatData = false) => {

    lang = lang.toUpperCase();

    try {

        const client = await sapPool.acquire();
        let organizationData = await client.call('ZHR_FINGERPRINT_ORG_STRU',{ 
            IM_OTYPE: 'O',
            IM_OBJID: '00000100',
            IM_PLVAR: '01',
            IM_BEGDA: date.formatDate(fromDate, date.defaultSapCompiledDateFormat),
            IM_ENDDA: date.formatDate(toDate, date.defaultSapCompiledDateFormat),
            IM_LANGU: lang
        });

        if(!organizationData || !organizationData['T_1001']) {
            return [];
        }

        const departments = [];

        //Split departments from positions
        for (let orgnizationUnit of organizationData['T_1001']
            .filter(org => org.OTYPE === 'O')) {

            let currentDepartment = departments.find(department => department.id === orgnizationUnit.OBJID);

            if(!currentDepartment) {
                const departmentInfo = organizationData['T_1000']
                .find(dept => dept.OTYPE === 'O' 
                    && dept.OBJID === orgnizationUnit.OBJID
                    && dept.LANGU === lang
                );

                currentDepartment = {
                    id: orgnizationUnit.OBJID,
                    name: departmentInfo ? departmentInfo.STEXT : '',
                    childDepartments: []
                };

                departments.push(currentDepartment);
            }

            if(orgnizationUnit.SCLAS === 'O') {

                let childDepartment = departments.find(department => 
                    department.id === orgnizationUnit.SOBID);

                if(!childDepartment) {
                    const childDepartmentInfo = organizationData['T_1000']
                    .find(dept => dept.OTYPE === 'O' 
                        && dept.OBJID === orgnizationUnit.SOBID
                        && dept.LANGU === lang
                    );

                    childDepartment = {
                        id: orgnizationUnit.SOBID,
                        name: childDepartmentInfo ? childDepartmentInfo.STEXT : '',
                        childDepartments: []
                    }
                    departments.push(childDepartment);
                }

                childDepartment.parentDepartmentId = currentDepartment.id;
                childDepartment.parentDepartmentName = currentDepartment.name;
                currentDepartment.childDepartments.push(childDepartment);
                
            }

        }

        if(flatData) {
            departments.forEach(department => {
                 department.childDepartments = [];
            });

            return departments;
        }

        const departmentsResult = departments.filter(department => !department.parentDepartmentId);

        return departmentsResult;

    } catch(e) {
        throw new Error(e.message);
    }
}

exports.getDepartmentById = async (departmentId, fromDate = new Date(), toDate = new Date(), lang = 'A', childsDepth = -1) => {

    lang = lang.toUpperCase();

    try {

        const flatDepartments = await this.getAllDepartments(fromDate, toDate, lang, true);
        const resultDepartment = flatDepartments.find(department => department.id === departmentId);

        if(resultDepartment && childsDepth !== 0) {

            resultDepartment.childDepartments = flatDepartments
                .filter(department => department.parentDepartmentId === resultDepartment.id);

            let currentLevelDepth = 1;
            let currentLevelChildDepartments = resultDepartment.childDepartments;

            while(currentLevelChildDepartments.length > 0 && (childsDepth < 0 || currentLevelDepth < childsDepth)) {

                let nextLevelChildDepartments = [];
                for(let department of currentLevelChildDepartments) {
                    department.childDepartments = flatDepartments
                        .filter(dept => dept.parentDepartmentId === department.id);
                    nextLevelChildDepartments.push(...department.childDepartments);
                }

                currentLevelChildDepartments = nextLevelChildDepartments;
                currentLevelDepth++;
            }
        }
        else if(resultDepartment){
            resultDepartment.childDepartments = [];
        }

        return resultDepartment;

    } catch(e) {
        throw new Error(e.message);
    }

}

exports.getChildDepartments = async (departmentId 
    , fromDate = new Date(), toDate = new Date()
    , lang = 'ِA', childsDepth = -1, flatData = false )  => {

    lang = lang.toUpperCase();
    childsDepth = childsDepth === 0 ? -1 : childsDepth;

    try {

        const parentDepartment = await this.getDepartmentById(departmentId, fromDate, toDate, lang, childsDepth);

        const childDepartments = [];

        //TODO create flat
        if(parentDepartment 
            && parentDepartment.childDepartments 
            && parentDepartment.childDepartments.length > 0) {

            if (flatData) {

                let currentLevelChildDepartments = parentDepartment.childDepartments;
                let nextLevelChildDepartments = [];

                while(currentLevelChildDepartments.length > 0) {

                    for (let department of currentLevelChildDepartments) {
                        nextLevelChildDepartments.push(...department.childDepartments);
                        department.childDepartments = [];
                        childDepartments.push(department);
                    }

                    currentLevelChildDepartments = nextLevelChildDepartments;
                    nextLevelChildDepartments = []
                }

            } else {
                childDepartments.push(...parentDepartment.childDepartments);
            }
        }

        return childDepartments;
    } catch (e) {
        console.log(e)
        throw new Error(e.message);
    }
}