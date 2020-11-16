const Country = require('../models/country.model');
const City = require('../models/city.model');
const Employee = require('../models/employee.model');
const { dateUtil } = require('@abujude/sgs-khadamati');

exports.mapCountryDTO = (sapCountry) => {
    return new Country(sapCountry.LAND1,
         sapCountry.LANDX50,
         sapCountry.NATIO50);
};

exports.mapCityDTO = (sapCity) => {
    return new City(sapCity.CITYC,
         sapCity.BEZEI,
         sapCity.LAND1,
         sapCity.REGIO);
}

exports.mapEmployeeDTO = (sapEmployee) => {

    let employee = new Employee(
        +sapEmployee.PERNR,
        sapEmployee.FNAMR,
        sapEmployee.NABIR,
        sapEmployee.NICKR,
        sapEmployee.LNAMR,
        sapEmployee.VORNA,
        sapEmployee.NACH2,
        sapEmployee.MIDNM,
        sapEmployee.NACHN,
        dateUtil.convertFormat(sapEmployee.GBDAT
            , dateUtil.defaultSapCompiledFormat
            , dateUtil.defaultCompiledFormat),
        sapEmployee.ORGEH,
        sapEmployee.OSTEXT,
        sapEmployee.NATIO,
        dateUtil.convertFormat(sapEmployee.BEGDA
            , dateUtil.defaultSapCompiledFormat
            , dateUtil.defaultCompiledFormat),
        sapEmployee.PGTXT,
        sapEmployee.CSTEXT,
        sapEmployee.CELL,
        sapEmployee.PSTEXT,
        sapEmployee.ICTXT,
        sapEmployee.ICNUM,
        sapEmployee.MAIL,
        sapEmployee.TEXT1,
        sapEmployee.ITICK,
        sapEmployee.OTICK,
        sapEmployee.TRFGR,
        sapEmployee.TRFST,
        sapEmployee.CITYC,
        sapEmployee.BTEXT,
        dateUtil.convertFormat(sapEmployee.FPDAT
            , dateUtil.defaultSapCompiledFormat
            , dateUtil.defaultCompiledFormat),
        dateUtil.convertFormat(sapEmployee.EXPID
            , dateUtil.defaultSapCompiledFormat
            , dateUtil.defaultCompiledFormat));

        return employee;

}
