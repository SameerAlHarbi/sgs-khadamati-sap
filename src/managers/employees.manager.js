const sapPool = require('../util/sap-rfc');
const modelMapper = require('../models/model-mapper');
const { dateUtil } = require('@abujude/sgs-khadamati');
const Employee = require('../models/employee.model');
const Salary = require('../models/salary.model');

/**
 * Get all employees in SAP system.
 * @param {Array<string>} employeesIds Array of employees ids to filter results.
 * @param {Date} fromDate History data start date.
 * @param {Date} toDate History data end date.
 * @param {string} status  Status of employees
 * @param {string} lang Results language.
 * @return {Array<Employee>} Employees information.
 */
exports.getAllEmployees = async (employeesIds = [], 
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
            IM_PERNR: employeesIds,
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

    } catch (error) {
        throw error;
    }
}

/**
 * Get employee by id.
 * @param {string} employeeId Employee Id.
 * @param {string} lang Results language.
 * @return {Employee} Employee information.
 */
exports.getEmployeeById = async (employeeId, lang = 'A') => {

    if(!employeeId  || isNaN(employeeId)) {
        throw new Error('Invalid employee id!');
    }

    try {

        const results = await this.getAllEmployees([employeeId], undefined, undefined, 'all', lang);
        return results[0];

    } catch(error) {
        throw error;
    }

}

/**
 * Get employee salary information.
 * @param {string} employeeId Employee Id.
 * @param {Date} fromDate History data start date.
 * @param {Date} toDate History data end date.
 * @return {Salary} Employee salary information.
 */
exports.getEmployeeSalary = async (employeeId, 
    fromDate = new Date(), 
    toDate = new Date()) => {

    if(!employeeId || isNaN(employeeId)) {
        throw new Error('Invalid employee id!');
    }

    try {

        const sapClient = await sapPool.acquire();
        const result = await sapClient.call('ZHR_LETTER_ALLOWANCE', {
            IM_PERNR: employeeId,
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

    } catch (error) { 
        throw error;
    }
}

/**
 * Get employee manager information.
 * @param {string} employeeId Employee id.
 * @param {Date} fromDate History data start date.
 * @param {Date} toDate History data end date.
 * @param {string} lang Results language.
 * @return {Employee} Employee manager Information.
 */
exports.getEmployeeManager = async (employeeId,
     fromDate = new Date(),
     toDate = new Date(),
     lang = 'A') => {

    try {

        if(!employeeId || isNaN(employeeId)) {
            throw new Error('Invalid employee id!');
        }

        lang = lang.toUpperCase();

        const sapClient = await sapPool.acquire();

        //TODO: CALL ABDULLAH return undefined if employee not found!

        const result = await sapClient.call('ZHR_GET_EMPLOYEE_MANAGER_FULL', {
            IM_PERNR: employeeId,
            IM_BEGDA: dateUtil.formatDate(fromDate, dateUtil.defaultSapCompiledFormat),
            IM_ENDDA: dateUtil.formatDate(toDate, dateUtil.defaultSapCompiledFormat)
        }); 

        if(!result || !result['EX_PERNR'] || isNaN(result['EX_PERNR'])) {
            return undefined;
        }

        const managerInfo = await this.getAllEmployees([result['EX_PERNR']], fromDate, toDate, undefined,lang);

        return managerInfo[0];

    } catch (error) {
        throw error;
    }
}
