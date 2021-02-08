const sapPool = require('../util/sap-rfc');
const Employee = require('../models/employee.model');
const Salary = require('../models/salary.model');
const modelMapper = require('../models/model-mapper');
const { dateUtil } = require('@abujude/sgs-khadamati');

/**
 * Get all employees in SAP system.
 * @param {Array<string>} ids Array of employees ids to filter results.
 * @param {Date} fromDate History data start date.
 * @param {Date} toDate History data end date.
 * @param {string} status  Status of employees
 * @param {string} lang Results language.
 * @return {Array<Employee>} Employees information.
 */
exports.getAllEmployees = async (ids = [], 
    fromDate = new Date(), 
    toDate = new Date(), 
    status = 'date', 
    lang = 'A') => {

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

        const sapParams = { 
            IM_PERNR: ids,
            IM_BEGDA: dateUtil.formatDate(fromDate, dateUtil.defaultSapCompiledFormat),
            IM_ENDDA: dateUtil.formatDate(toDate, dateUtil.defaultSapCompiledFormat),
            IM_LANGU: lang
          };

          if(status !== 'date') {
              sapParams.IM_EM_STATUS = status;
          }

        const sapClient = await sapPool.acquire();
        const results = await sapClient.call('ZHR_FINGERPRINT_EMPLOYEE_DATA', sapParams);
        if(!results || !results['T_EMPDATA']) {
            return [];
        }

        return results['T_EMPDATA'].map(result => modelMapper.mapEmployeeDTO(result));

    } catch (e) {
        throw new Error(e.message);
    }
}

/**
 * Get employee by id.
 * @param {string} id Employee Id.
 * @param {string} lang Results language.
 * @return {Employee} Employee information.
 */
exports.getEmployeeById = async (id, lang = 'A') => {

    if(!id  || isNaN(id)) {
        throw new Error('Employee id is required!');
    }

    try {

        const results = await this.getAllEmployees([id], undefined, undefined, 'all', lang);
        return results[0];

    } catch(e) {
        throw new Error(e.message);
    }

}

/**
 * Get employee salary information.
 * @param {string} id Employee Id.
 * @param {Date} fromDate History data start date.
 * @param {Date} toDate History data end date.
 * @return {Salary} Employee salary information.
 */
exports.getEmployeeSalary = async (id, 
    fromDate = new Date(), 
    toDate = new Date()) => {

    try {

        if(!id || isNaN(id)) {
            throw new Error('employee id required!')
        }

        const sapClient = await sapPool.acquire();
        const result = await sapClient.call('ZHR_LETTER_ALLOWANCE', {
            IM_PERNR: id,
            IM_BEGDA: dateUtil.formatDate(fromDate, dateUtil.defaultSapCompiledFormat),
            IM_ENDDA: dateUtil.formatDate(toDate, dateUtil.defaultSapCompiledFormat)
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

        return new Salary(basicSalary.BETRG,
            transportationAllowance ? transportationAllowance.BETRG : 0,
            housingAllowance ? housingAllowance.BETRG : 0,
            OtherAllowance ? OtherAllowance.BETRG : 0);

    } catch (e) { 
        throw new Error(e.message);
    }
}

/**
 * Get employee manager information.
 * @param {string} id Employee id.
 * @param {Date} fromDate History data start date.
 * @param {Date} toDate History data end date.
 * @param {string} lang Results language.
 * @return {Employee} Employee manager Information.
 */
exports.getEmployeeManager = async (id,
     fromDate = new Date(),
     toDate = new Date(),
     lang = 'A') => {

    try {

        if(!id || isNaN(id)) {
           throw new Error('employee id required!')
        }

        lang = lang.toUpperCase();

        const sapClient = await sapPool.acquire();

        //TODO: CALL ABDULLAH return undefined if employee not found!

        const result = await sapClient.call('ZHR_GET_EMPLOYEE_MANAGER_FULL', {
            IM_PERNR: id,
            IM_BEGDA: dateUtil.formatDate(fromDate, dateUtil.defaultSapCompiledFormat),
            IM_ENDDA: dateUtil.formatDate(toDate, dateUtil.defaultSapCompiledFormat)
        }); 

        if(!result || !result['EX_PERNR'] || isNaN(result['EX_PERNR'])) {
            return undefined;
        }

        const managerInfo = await this.getAllEmployees([result['EX_PERNR']], fromDate, toDate, undefined,lang);

        return managerInfo[0];

    } catch (e) {
        throw new Error(e.message);
    }
}

exports.getAllDepartmentEmployees = async (departmentCode
    , fromDate = new Date()
    , toDate = new Date()
    , lang = 'A') => {

    try {

        if(!departmentCode || isNaN(departmentCode)) {
            throw new Error('department code is required!')
        }

        const client = await sapPool.acquire();
        let results = await client.call('ZHR_PERSONS_SUB_ORG_UNITS', {
            IM_ORG_UNIT: departmentCode,
            IM_BEGDA: dateUtil.formatDate(fromDate, dateUtil.defaultSapCompiledFormat),
            IM_ENDDA: dateUtil.formatDate(toDate, dateUtil.defaultSapCompiledFormat)
        });

        if(!results || !results['T_ORG_UNITS']) {
            return [];
        }

        const employeesIds = results['T_ORG_UNITS'].filter( r => r.OTYPE === 'P').map(r => r.OBJID);

        const employeesInfo = await this.getAllEmployees(employeesIds, fromDate, toDate, undefined, lang);

        return employeesInfo;

    } catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}