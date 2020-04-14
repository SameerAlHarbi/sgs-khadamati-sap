module.exports = class Employee {
    constructor(employeeId,
        firstNameAR,
        fatherNameAR,
        grandFatherNameAR,
        lastNameAR,
        firstNameEN,
        fatherNameEN,
        grandFatherNameEN,
        lastNameEN,
        birthDate,
        departmentId,
        departmentName,
        nationality,
        hireDate,
        jobsSystem,
        managmentPosition,
        mobileNumber,
        jobTitle,
        identityType,
        identityNumber,
        email,
        employeeStatusText,
        internalTicketClass,
        externalTicketClass,
        rank,
        grand,
        subAreaCode,
        subArea,
        issueDate,
        expireDate) {
        this.employeeId = employeeId;
        this.firstNameAR = firstNameAR;
        this.fatherNameAR = fatherNameAR;
        this.grandFatherNameAR = grandFatherNameAR;
        this.lastNameAR = lastNameAR;
        this.fullNameAr =  `${this.firstNameAR} ${this.fatherNameAR} ${this.grandFatherNameAR} ${this.lastNameAR}`.trim();
        this.firstNameEN = firstNameEN;
        this.fatherNameEN = fatherNameEN;
        this.grandFatherNameEN = grandFatherNameEN;
        this.lastNameEN = lastNameEN;
        this.fullNameEN =  `${this.firstNameEN} ${this.fatherNameEN} ${this.grandFatherNameEN} ${this.lastNameEN}`.trim();
        this.birthDate = birthDate;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.nationality = nationality;
        this.hireDate = hireDate;
        this.jobsSystem = jobsSystem;
        this.managmentPosition = managmentPosition;
        this.mobileNumber = mobileNumber;
        this.jobTitle = jobTitle;
        this.identityType = identityType,
        this.identityNumber = identityNumber,
        this.email = email;
        this.employeeStatusText = employeeStatusText;
        this.internalTicketClass = internalTicketClass;
        this.externalTicketClass = externalTicketClass;
        this.rank =  rank;
        this.grade = grand;
        this.subAreaCode = subAreaCode;
        this.subArea = subArea;
        this.issueDate = issueDate,
        this.expireDate = expireDate
     }
}