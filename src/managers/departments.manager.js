const sapPool = require('../util/sap-rfc');
const { dateUtil } = require('@abujude/sgs-khadamati');
const employeesManager = require('./employees.manager');

exports.getAllDepartments = async (fromDate = new Date()
    , toDate = new Date()
    , flat = false
    , lang = 'ِA') => {

    lang = lang.toUpperCase();

    try {

        const sapClient = await sapPool.acquire();
        const organizationData = await sapClient.call('ZHR_FINGERPRINT_ORG_STRU',{ 
            IM_OTYPE: 'O',
            IM_OBJID: '00000100',
            IM_PLVAR: '01',
            IM_BEGDA: dateUtil.formatDate(fromDate, dateUtil.defaultSapCompiledFormat),
            IM_ENDDA: dateUtil.formatDate(toDate, dateUtil.defaultSapCompiledFormat),
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

        if(flat) {
            departments.forEach(department => {
                 department.childDepartments = [];
            });

            return departments;
        }

        const departmentsResult = departments.filter(department => !department.parentDepartmentId);

        return departmentsResult;

    } catch(error) {
        throw error;
    }
}

exports.getDepartmentById = async (departmentId
    , fromDate = new Date()
    , toDate = new Date()
    , childsDepth = -1
    , lang = 'A') => {

    if(!departmentId) {
        throw new Error('Invalid department id!');
    }

    lang = lang.toUpperCase();

    try {

        const flatDepartments = await this.getAllDepartments(fromDate, toDate, true, lang);
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

    } catch(error) {
        throw error;
    }

}

exports.getChildDepartments = async (departmentId 
    , fromDate = new Date()
    , toDate = new Date()
    , flat = false
    , childDepth = -1
    , lang = 'ِA')  => {

    if(!departmentId) {
        throw new Error('Invalid department id!');
    }

    lang = lang.toUpperCase();
    childDepth = childDepth === 0 ? -1 : childDepth;

    try {
        
        const parentDepartment = await this.getDepartmentById(departmentId, fromDate, toDate, childDepth, lang);

        const childDepartments = [];

        //TODO create flat
        if(parentDepartment 
            && parentDepartment.childDepartments 
            && parentDepartment.childDepartments.length > 0) {

            if (flat) {

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
    } catch (error) {
        throw error;
    }
}

exports.getAllDepartmentEmployees = async (departmentId
    , fromDate = new Date()
    , toDate = new Date()
    , lang = 'A') => {

    if(!departmentId) {
        throw new Error('Invalid department id!');
    }

    try {

        const sapClient = await sapPool.acquire();
        let results = await sapClient.call('ZHR_PERSONS_SUB_ORG_UNITS', {
            IM_ORG_UNIT: departmentId,
            IM_BEGDA: dateUtil.formatDate(fromDate, dateUtil.defaultSapCompiledFormat),
            IM_ENDDA: dateUtil.formatDate(toDate, dateUtil.defaultSapCompiledFormat)
        });

        if(!results || !results['T_ORG_UNITS']) {
            return [];
        }

        const employeesIds = results['T_ORG_UNITS'].filter( r => r.OTYPE === 'P').map(r => r.OBJID);

        const employeesInfo = await employeesManager.getAllEmployees(employeesIds, fromDate, toDate, undefined, lang);
        return employeesInfo;

    } catch (error) {
        throw error;
    }
}