const date = require('date-and-time');

exports.defaultApiDateFormatText = 'YYYY-MM-DD';
exports.defaultSapDateFormatText = 'YYYYMMDD';
exports.defaultSapCompiledDateFormat = date.compile(this.defaultSapDateFormatText);
exports.defaultApiCompiledDateFormat = date.compile(this.defaultApiDateFormatText);

exports.parseDate = (dateText, dateFormat = this.defaultSapCompiledDateFormat) => {

    if(!dateText) {
        return undefined;
    }

    let parsedDate = date.parse(dateText, dateFormat);

    return parsedDate;
    // return !isNaN(parsedDate) ? parsedDate : "";
}

exports.formatDate = (dateObject, dateFormat = this.defaultApiCompiledDateFormat) => {

    if(!dateObject || isNaN(dateObject)) {
        return "";
    }

    let formatedDate = date.format(dateObject, dateFormat);

    return formatedDate;
}

exports.convertFormat = (dateText, 
    dateFormat = this.defaultSapCompiledDateFormat, 
    newFormat = this.defaultApiCompiledDateFormat) => {

    let parsedDate = this.parseDate(dateText, dateFormat);

    if(!parsedDate || isNaN(parsedDate)) {
        return "";
    }

    let formatedDate = this.formatDate(parsedDate, newFormat);
    return formatedDate;
}

exports.calcDaysDuration = (startDateObject, endDateObject) => {

    return date.subtract(endDateObject, startDateObject).toDays() + 1;

}