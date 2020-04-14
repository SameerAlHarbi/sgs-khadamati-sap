const sapPool = require('../util/sap-rfc');
const date = require('../util/date');

exports.getAllDepartments = async (fromDate = new Date(), toDate = new Date(), lang = 'ِA') => {

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
            const departmentInfo = organizationData['T_1000']
                    .find(dept => dept.OTYPE === 'O' 
                        && dept.OBJID === orgnizationUnit.OBJID
                        && dept.LANGU === lang
                    );

            if(!currentDepartment) {
                currentDepartment = {
                    id: orgnizationUnit.OBJID,
                    name: departmentInfo ? departmentInfo.STEXT : ''
                };
                departments.push(currentDepartment)
            }

            let childDepartment = departments.find(department => 
                    department.id === orgnizationUnit.SOBID);

            if(childDepartment) {
                childDepartment.parentDepartmentId = currentDepartment.id;
                childDepartment.parentDepartment = currentDepartment;
            } else {
                const childDepartmentInfo = organizationData['T_1000']
                    .find(dept => dept.OTYPE === 'O' 
                        && dept.OBJID === orgnizationUnit.SOBID
                        && dept.LANGU === lang
                    );

                if(childDepartmentInfo) {
                    childDepartment = {
                        id: orgnizationUnit.SOBID,
                        name: childDepartmentInfo ? childDepartmentInfo.STEXT : '',
                        parentDepartmentId: currentDepartment.id,
                        parentDepartment: currentDepartment
                    }
                    departments.push(childDepartment);
                }
            }       
        }

        return departments;

    } catch(e) {
        console.log(e)
        throw new Error(e.message);
    }
}