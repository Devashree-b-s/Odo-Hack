const Employee = require("../models/Employee");

function firstLetters(value) {
    const letters = String(value || "").replace(/[^a-z]/gi, "").toUpperCase();
    return (letters.slice(0, 2) + "XX").slice(0, 2);
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function generateEmployeeCode({ company, firstName, lastName, joiningDate, session }) {
    const prefix = `${firstLetters(company.name)}${firstLetters(firstName)}${firstLetters(lastName)}${joiningDate.getFullYear()}`;
    const existingEmployees = await Employee.find({
        companyId: company._id,
        employeeCode: new RegExp(`^${escapeRegExp(prefix)}(\\d+)$`)
    }).select("employeeCode").session(session).lean();

    const highestSerial = existingEmployees.reduce((highest, employee) => {
        const serial = Number(employee.employeeCode.slice(prefix.length));
        return Number.isSafeInteger(serial) && serial > highest ? serial : highest;
    }, 0);

    return `${prefix}${String(highestSerial + 1).padStart(4, "0")}`;
}

module.exports = { generateEmployeeCode };
