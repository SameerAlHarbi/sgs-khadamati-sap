const sapPool = require('../util/sap-rfc');
const modelMapper = require('../models/model-mapper');
const SalaryModel = require('../models/salary.model');
const date = require('../util/date');

exports.getAllEmployeesInfo = async (employeesIds = [], fromDate = new Date(), toDate = new Date(), status = 'date', lang = 'A') => {

    lang = lang.toUpperCase();

    switch(status) {
        case 'all': 
            status = ' ';
            break;
        case 'active':
            status = '3';
            break;
        case 'inactive':
            status = '0';
            break;
        default:
            status = 'date';
    }

    try {

        let sapParams = { 
            IM_PERNR: employeesIds,
            IM_BEGDA: date.formatDate(fromDate, date.defaultSapCompiledDateFormat),
            IM_ENDDA: date.formatDate(toDate, date.defaultSapCompiledDateFormat),
            IM_LANGU: lang
          };

          if(status !== 'date') {
              sapParams.IM_EM_STATUS = status;
          }

        const client = await sapPool.acquire();

        let results = await client.call('ZHR_FINGERPRINT_EMPLOYEE_DATA', sapParams);

        if(!results || !results['T_EMPDATA']) {
            return [];
        }

        return results['T_EMPDATA'].map( result => modelMapper.mapEmployeeDTO(result));
    } catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}

exports.getEmployeeSalaryInfo = async (employeeId, fromDate = new Date(), toDate = new Date()) => {

    try {

        if(!employeeId || isNaN(employeeId)) {
            throw new Error('employee id required!')
        }

        const client = await sapPool.acquire();
        const result = await client.call('ZHR_LETTER_ALLOWANCE', {
            IM_PERNR: employeeId,
            IM_BEGDA: date.formatDate(fromDate, date.defaultSapCompiledDateFormat),
            IM_ENDDA: date.formatDate(toDate, date.defaultSapCompiledDateFormat)
        });

        if(!result || !result['PPBWLA']) {
            return undefined;
        }

        const basicSalary = result['PPBWLA'].find(s => s.LGART == 'M020');
        const transportationAllowance = result['PPBWLA'].find(s => s.LGART == 'MU07');
        const housingAllowance = result['PPBWLA'].find(s => s.LGART == '204J');
        const OtherAllowance = result['PPBWLA'].find(s => s.LGART == 'OTHR');

        if(!basicSalary) {
            return undefined;
        }

        return new SalaryModel(basicSalary ? basicSalary.BETRG : 0,
            transportationAllowance ? transportationAllowance.BETRG : 0,
            housingAllowance ? housingAllowance.BETRG : 0,
            OtherAllowance ? OtherAllowance.BETRG : 0);

    } catch (e) { 
        console.log(e);
        throw new Error(e.message);
    }
}

exports.getEmployeeManagerInfo = async (employeeId, fromDate = new Date(), toDate = new Date(), lang = 'A') => {

    try {

        if(!employeeId || isNaN(employeeId)) {
           throw new Error('employee id required!')
        }

        const client = await sapPool.acquire();

        //TODO: CALL ABDULLAH return undefined if employee not found!

        const result = await client.call('ZHR_GET_EMPLOYEE_MANAGER_FULL', {
            IM_BEGDA: date.formatDate(fromDate, date.defaultSapCompiledDateFormat),
            IM_ENDDA: date.formatDate(toDate, date.defaultSapCompiledDateFormat),
            IM_PERNR: employeeId
        }); 

        if(!result || !result['EX_PERNR'] || isNaN(result['EX_PERNR'])) {
            return undefined;
        }

        const managerInfo = await this.getAllEmployeesInfo([result['EX_PERNR']], fromDate, toDate, undefined,lang);

        if(!managerInfo || !managerInfo[0]) {
            return undefined;
        }

        return managerInfo[0];

    } catch (e) {
        throw new Error(e.message);
    }
}

exports.getAllDepartmentEmployees = async (departmentCode, fromDate = new Date(), toDate = new Date(), lang = 'A') => {

    try {

        if(!departmentCode || isNaN(departmentCode)) {
            throw new Error('department code is required!')
        }

        const client = await sapPool.acquire();
        let results = await client.call('ZHR_PERSONS_SUB_ORG_UNITS', {
            IM_ORG_UNIT: departmentCode,
            IM_BEGDA: date.formatDate(fromDate, date.defaultSapCompiledDateFormat),
            IM_ENDDA: date.formatDate(toDate, date.defaultSapCompiledDateFormat)
        });

        if(!results || !results['T_ORG_UNITS']) {
            return [];
        }

        const employeesIds = results['T_ORG_UNITS'].filter( r => r.OTYPE === 'P').map(r => r.OBJID);

        const employeesInfo = await this.getAllEmployeesInfo(employeesIds, fromDate, toDate, undefined, lang);

        return employeesInfo;

    } catch (e) {
        throw new Error(e.message);
    }
}