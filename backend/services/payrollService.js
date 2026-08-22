const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");
const SalaryStructure = require("../models/SalaryStructure");
const Attendance = require("../models/Attendance");
const LeaveRequest = require("../models/LeaveRequest");

const isValidMonth = (month) => Number(month) >= 1 && Number(month) <= 12;
const isValidYear = (year) => Number(year) >= 1970 && Number(year) <= 9999;

const monthBounds = (year, month) => {
    const start = new Date(Date.UTC(Number(year), Number(month) - 1, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(Number(year), Number(month), 0, 23, 59, 59, 999));
    return { start, end };
};

const getEmployeeCompanyScope = async (employeeId, user) => {
    const employee = await Employee.findById(employeeId).lean();

    if (!employee) {
        return { employee: null, allowed: false };
    }

    const userCompanyId = user?.companyId ? user.companyId.toString() : null;
    const employeeCompanyId = employee.companyId ? employee.companyId.toString() : null;

    if (!userCompanyId || !employeeCompanyId || userCompanyId !== employeeCompanyId) {
        return { employee, allowed: false };
    }

    return { employee, allowed: true };
};

const getApplicableSalaryStructure = async (employeeId, year, month) => {
    const { start, end } = monthBounds(year, month);

    const record = await SalaryStructure.findOne({
        employeeId,
        effectiveFrom: { $lte: end },
        $or: [
            { effectiveTo: null },
            { effectiveTo: { $gte: start } }
        ]
    }).sort({ effectiveFrom: -1 }).lean();

    return record;
};

const getApprovedLeaveDays = async (employeeId, year, month) => {
    const { start, end } = monthBounds(year, month);

    const approvedLeaves = await LeaveRequest.find({
        employeeId,
        status: "APPROVED",
        startDate: { $lte: end },
        endDate: { $gte: start }
    }).lean();

    let approvedDays = 0;

    for (const leave of approvedLeaves) {
        const overlapStart = new Date(Math.max(new Date(leave.startDate).getTime(), start.getTime()));
        const overlapEnd = new Date(Math.min(new Date(leave.endDate).getTime(), end.getTime()));
        const diffDays = Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        approvedDays += Math.max(diffDays, 0);
    }

    return approvedDays;
};

const calculateAttendanceAdjustment = async (employeeId, year, month, monthlyWage) => {
    const { start, end } = monthBounds(year, month);
    const attendanceRecords = await Attendance.find({
        employeeId,
        date: { $gte: start, $lte: end }
    }).lean();

    const approvedLeaveDays = await getApprovedLeaveDays(employeeId, year, month);
    const monthDays = new Date(year, month, 0).getDate();
    const dailyRate = monthDays > 0 ? Number(monthlyWage) / monthDays : 0;

    let unpaidAbsenceDays = 0;

    for (const record of attendanceRecords) {
        const status = record.status;

        if (status === "ABSENT") {
            unpaidAbsenceDays += 1;
        }

        if (status === "HALF_DAY") {
            unpaidAbsenceDays += 0.5;
        }
    }

    const netUnpaidAbsenceDays = Math.max(unpaidAbsenceDays - approvedLeaveDays, 0);
    const adjustment = dailyRate * netUnpaidAbsenceDays;

    return Number(adjustment.toFixed(2));
};

const generatePayrollSnapshot = async (employeeId, year, month) => {
    const salary = await getApplicableSalaryStructure(employeeId, year, month);

    if (!salary) {
        const error = new Error("Salary structure not found for the requested payroll period.");
        error.statusCode = 404;
        throw error;
    }

    const grossSalary = Number(salary.monthlyWage || 0);
    const providentFund = Number(salary.providentFund || 0);
    const professionalTax = Number(salary.professionalTax || 0);
    const attendanceAdjustment = await calculateAttendanceAdjustment(employeeId, year, month, grossSalary);
    const netSalary = Math.max(grossSalary - attendanceAdjustment - providentFund - professionalTax, 0);

    return {
        employeeId,
        month: Number(month),
        year: Number(year),
        grossSalary,
        attendanceAdjustment,
        deductions: {
            providentFund,
            professionalTax
        },
        netSalary,
        status: "DRAFT",
        generatedAt: new Date()
    };
};

const buildPayrollFilters = ({ employeeId, month, year, status }) => {
    const filters = {};

    if (employeeId) {
        filters.employeeId = employeeId;
    }

    if (month) {
        filters.month = Number(month);
    }

    if (year) {
        filters.year = Number(year);
    }

    if (status) {
        filters.status = status;
    }

    return filters;
};

module.exports = {
    isValidMonth,
    isValidYear,
    monthBounds,
    getEmployeeCompanyScope,
    getApplicableSalaryStructure,
    getApprovedLeaveDays,
    calculateAttendanceAdjustment,
    generatePayrollSnapshot,
    buildPayrollFilters
};
