const Employee = require("../models/Employee");
const SalaryStructure = require("../models/SalaryStructure");
const {
    validateSalaryPayload,
    getEmployeeCompanyScope,
    getSalaryStructureByEmployee,
    updateSalaryStructure
} = require("../services/salaryService");

const ensureHrAdmin = (req) => {
    if (!req.user || req.user.role !== "HR_ADMIN") {
        const error = new Error("Only HR_ADMIN can access salary records.");
        error.statusCode = 403;
        throw error;
    }
};

const getSalaryByEmployee = async (req, res) => {
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

        const salary = await getSalaryStructureByEmployee(employeeId);

        if (!salary) {
            return res.status(404).json({
                success: false,
                message: "Salary structure not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: salary
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to retrieve salary structure"
        });
    }
};

const updateSalaryByEmployee = async (req, res) => {
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

        const { normalized, errors } = validateSalaryPayload(req.body || {});

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: errors.join(" ")
            });
        }

        const salary = await updateSalaryStructure({ employeeId, payload: normalized });

        return res.status(200).json({
            success: true,
            message: "Salary structure updated successfully",
            data: salary
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to update salary structure"
        });
    }
};

module.exports = {
    getSalaryByEmployee,
    updateSalaryByEmployee
};
