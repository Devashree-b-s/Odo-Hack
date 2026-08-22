const Employee = require("../models/Employee");
const Payroll = require("../models/Payroll");
const {
    isValidMonth,
    isValidYear,
    monthBounds,
    getEmployeeCompanyScope,
    generatePayrollSnapshot,
    buildPayrollFilters
} = require("../services/payrollService");

const ensureHrAdmin = (req) => {
    if (!req.user || req.user.role !== "HR_ADMIN") {
        const error = new Error("Only HR_ADMIN can access payroll records.");
        error.statusCode = 403;
        throw error;
    }
};

const ensureEmployeeOnly = (req) => {
    if (!req.user || req.user.role !== "EMPLOYEE") {
        const error = new Error("Only employees can access their own payroll.");
        error.statusCode = 403;
        throw error;
    }

    if (!req.user.employeeId) {
        const error = new Error("req.user.employeeId is required for payroll access.");
        error.statusCode = 401;
        throw error;
    }
};

const getCompanyEmployees = async (companyId) => {
    const employees = await Employee.find({ companyId }).lean();
    return employees.map((employee) => employee._id);
};

const createPayroll = async (req, res) => {
    try {
        ensureHrAdmin(req);

        const { employeeId, month, year } = req.body || {};

        if (!employeeId) {
            return res.status(400).json({
                success: false,
                message: "employeeId is required."
            });
        }

        if (!isValidMonth(month)) {
            return res.status(400).json({
                success: false,
                message: "Month must be between 1 and 12."
            });
        }

        if (!isValidYear(year)) {
            return res.status(400).json({
                success: false,
                message: "Year is invalid."
            });
        }

        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        if (!req.user.companyId || !employee.companyId || employee.companyId.toString() !== req.user.companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Employee does not belong to the authenticated HR_ADMIN's company"
            });
        }

        const existingPayroll = await Payroll.findOne({ employeeId, month: Number(month), year: Number(year) });

        if (existingPayroll) {
            return res.status(409).json({
                success: false,
                message: "Payroll already exists for the requested employee, month, and year."
            });
        }

        const snapshot = await generatePayrollSnapshot(employeeId, Number(year), Number(month));
        const payroll = await Payroll.create(snapshot);

        return res.status(201).json({
            success: true,
            message: "Payroll generated successfully",
            data: payroll
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to generate payroll"
        });
    }
};

const listPayroll = async (req, res) => {
    try {
        ensureHrAdmin(req);

        const companyId = req.user.companyId;
        if (!companyId) {
            return res.status(403).json({
                success: false,
                message: "Company context is required for payroll access."
            });
        }

        const employeeIds = await getCompanyEmployees(companyId);
        const filters = buildPayrollFilters(req.query);
        const payrollRecords = await Payroll.find({
            employeeId: { $in: employeeIds },
            ...filters
        }).sort({ year: -1, month: -1, employeeId: 1 });

        return res.status(200).json({
            success: true,
            count: payrollRecords.length,
            data: payrollRecords
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch payroll records"
        });
    }
};

const getPayrollByEmployee = async (req, res) => {
    try {
        ensureHrAdmin(req);

        const { employeeId } = req.params;
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        if (!req.user.companyId || !employee.companyId || employee.companyId.toString() !== req.user.companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Employee does not belong to the authenticated HR_ADMIN's company"
            });
        }

        const filters = buildPayrollFilters(req.query);
        const payrollRecords = await Payroll.find({ employeeId, ...filters }).sort({ year: -1, month: -1 });

        return res.status(200).json({
            success: true,
            count: payrollRecords.length,
            data: payrollRecords
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch employee payroll"
        });
    }
};

const getPayrollByEmployeeYearMonth = async (req, res) => {
    try {
        ensureHrAdmin(req);

        const { employeeId, year, month } = req.params;
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        if (!req.user.companyId || !employee.companyId || employee.companyId.toString() !== req.user.companyId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Employee does not belong to the authenticated HR_ADMIN's company"
            });
        }

        if (!isValidMonth(month) || !isValidYear(year)) {
            return res.status(400).json({
                success: false,
                message: "Invalid month or year."
            });
        }

        const record = await Payroll.findOne({ employeeId, month: Number(month), year: Number(year) });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Payroll record not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: record
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch payroll record"
        });
    }
};

const getMyPayroll = async (req, res) => {
    try {
        ensureEmployeeOnly(req);

        const filters = buildPayrollFilters(req.query);
        const payrollRecords = await Payroll.find({ employeeId: req.user.employeeId, ...filters }).sort({ year: -1, month: -1 });

        return res.status(200).json({
            success: true,
            count: payrollRecords.length,
            data: payrollRecords
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch your payroll records"
        });
    }
};

const getMyPayrollByYearMonth = async (req, res) => {
    try {
        ensureEmployeeOnly(req);

        const { year, month } = req.params;

        if (!isValidMonth(month) || !isValidYear(year)) {
            return res.status(400).json({
                success: false,
                message: "Invalid month or year."
            });
        }

        const payrollRecord = await Payroll.findOne({
            employeeId: req.user.employeeId,
            year: Number(year),
            month: Number(month)
        });

        if (!payrollRecord) {
            return res.status(404).json({
                success: false,
                message: "Payroll record not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: payrollRecord
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch your payroll record"
        });
    }
};

module.exports = {
    createPayroll,
    listPayroll,
    getPayrollByEmployee,
    getPayrollByEmployeeYearMonth,
    getMyPayroll,
    getMyPayrollByYearMonth
};
