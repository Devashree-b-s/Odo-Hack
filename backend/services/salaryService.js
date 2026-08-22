const SalaryStructure = require("../models/SalaryStructure");
const Employee = require("../models/Employee");

const SALARY_ALLOWED_FIELDS = [
    "monthlyWage",
    "yearlyWage",
    "basicSalary",
    "hra",
    "standardAllowance",
    "performanceBonus",
    "leaveTravelAllowance",
    "fixedAllowance",
    "providentFund",
    "professionalTax",
    "effectiveFrom",
    "effectiveTo"
];

const normalizeSalaryInput = (payload = {}) => {
    const cleaned = {};

    for (const field of SALARY_ALLOWED_FIELDS) {
        if (payload[field] !== undefined) {
            cleaned[field] = payload[field];
        }
    }

    return cleaned;
};

const validateSalaryPayload = (payload = {}) => {
    const errors = [];
    const normalized = normalizeSalaryInput(payload);

    for (const field of [
        "monthlyWage",
        "yearlyWage",
        "basicSalary",
        "hra",
        "standardAllowance",
        "performanceBonus",
        "leaveTravelAllowance",
        "fixedAllowance",
        "providentFund",
        "professionalTax"
    ]) {
        if (normalized[field] !== undefined && Number(normalized[field]) < 0) {
            errors.push(`${field} cannot be negative.`);
        }
    }

    if (normalized.effectiveFrom !== undefined) {
        const date = new Date(normalized.effectiveFrom);
        if (Number.isNaN(date.getTime())) {
            errors.push("effectiveFrom is not a valid date.");
        }
    }

    if (normalized.effectiveTo !== undefined && normalized.effectiveTo !== null) {
        const date = new Date(normalized.effectiveTo);
        if (Number.isNaN(date.getTime())) {
            errors.push("effectiveTo is not a valid date.");
        }
    }

    if (
        normalized.effectiveFrom !== undefined &&
        normalized.effectiveTo !== undefined &&
        normalized.effectiveTo !== null &&
        normalized.effectiveFrom !== null
    ) {
        const from = new Date(normalized.effectiveFrom);
        const to = new Date(normalized.effectiveTo);

        if (from > to) {
            errors.push("effectiveFrom must not be after effectiveTo.");
        }
    }

    return { normalized, errors };
};

const getEmployeeCompanyScope = async (employeeId, currentUser) => {
    const employee = await Employee.findById(employeeId).lean();

    if (!employee) {
        return { employee: null, companyMismatch: true };
    }

    const employeeCompanyId = employee.companyId && employee.companyId.toString();
    const userCompanyId = currentUser?.companyId && currentUser.companyId.toString();

    if (!userCompanyId || !employeeCompanyId || employeeCompanyId !== userCompanyId) {
        return { employee, companyMismatch: true };
    }

    return { employee, companyMismatch: false };
};

const getSalaryStructureByEmployee = async (employeeId) => {
    return SalaryStructure.findOne({ employeeId }).sort({ effectiveFrom: -1 }).lean();
};

const updateSalaryStructure = async ({ employeeId, payload }) => {
    const existing = await SalaryStructure.find({ employeeId }).sort({ effectiveFrom: -1 }).lean();
    const latest = existing[0] || null;

    const nextPayload = normalizeSalaryInput(payload);

    if (latest && latest.effectiveTo === null) {
        latest.effectiveTo = nextPayload.effectiveFrom || latest.effectiveFrom;
        await SalaryStructure.updateOne(
            { _id: latest._id },
            { $set: { effectiveTo: latest.effectiveTo } }
        );
    }

    const record = await SalaryStructure.create({
        employeeId,
        ...nextPayload,
        effectiveFrom: nextPayload.effectiveFrom || new Date(),
        effectiveTo: nextPayload.effectiveTo || null
    });

    return record;
};

module.exports = {
    SALARY_ALLOWED_FIELDS,
    validateSalaryPayload,
    getEmployeeCompanyScope,
    getSalaryStructureByEmployee,
    updateSalaryStructure
};
