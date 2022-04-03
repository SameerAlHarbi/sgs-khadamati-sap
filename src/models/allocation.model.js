module.exports = class Allocation {

    constructor(id, lineNumber, projectNumber, costCenter, currency, fundCenter, date, amount,
                employeeId, employeeName, allocationFund) {
        this.id = id;
        this.lineNumber = lineNumber;
        this.projectNumber = projectNumber;
        this.costCenter = costCenter;
        this.currency = currency;
        this.fundCenter = fundCenter;
        this.date = date;
        this.amount = amount;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.allocationFund = allocationFund
    }
}