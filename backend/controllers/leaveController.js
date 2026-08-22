const LeaveBalance = require("../models/LeaveBalance");
const LeaveRequest = require("../models/LeaveRequest");
const {
    getCurrentYear,
    calculateNumberOfDays,
    getLeaveBalanceSummaryForYear,
    normalizeFilters,
    getLeaveBalanceForYear
} = require("../services/leaveService");

const getCurrentEmployeeId = (req) => {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
        const error = new Error("req.user.employeeId is required for leave operations.");
        error.statusCode = 401;
        throw error;
    }

    return employeeId;
};

const getLeaveBalance = async (req, res) => {
    try {
        const employeeId = getCurrentEmployeeId(req);
        const year = getCurrentYear();
        const summary = await getLeaveBalanceSummaryForYear(employeeId, year);

        return res.status(200).json({
            employeeId,
            year,
            data: summary
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to retrieve leave balance.",
            error: process.env.NODE_ENV === "production" ? undefined : error.message
        });
    }
};

const getMyLeaveRequests = async (req, res) => {
    try {
        const employeeId = getCurrentEmployeeId(req);
        const filters = normalizeFilters({ ...req.query, employeeId });

        const requests = await LeaveRequest.find(filters).sort({ startDate: -1, createdAt: -1 });

        return res.status(200).json({
            count: requests.length,
            data: requests
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to retrieve leave requests.",
            error: process.env.NODE_ENV === "production" ? undefined : error.message
        });
    }
};

const createLeaveRequest = async (req, res) => {
    try {
        const employeeId = getCurrentEmployeeId(req);
        const {
            type,
            startDate,
            endDate,
            reason,
            employeeId: clientEmployeeId,
            status: clientStatus
        } = req.body || {};

        if (clientEmployeeId || clientStatus) {
            return res.status(400).json({
                message: "Employee identity and leave status are determined by the server and cannot be supplied by the client."
            });
        }

        if (!type || !startDate || !endDate) {
            return res.status(400).json({
                message: "type, startDate, and endDate are required."
            });
        }

        if (!['PAID', 'SICK', 'UNPAID'].includes(type)) {
            return res.status(400).json({
                message: "Leave type must be PAID, SICK, or UNPAID."
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return res.status(400).json({
                message: "startDate and endDate must be valid dates."
            });
        }

        if (start > end) {
            return res.status(400).json({
                message: "startDate cannot be after endDate."
            });
        }

        const numberOfDays = calculateNumberOfDays(start, end);

        if (type !== "UNPAID") {
            const year = new Date(start).getFullYear();
            const balance = await getLeaveBalanceForYear(employeeId, year);
            const requestedUsed = numberOfDays;
            const available =
                type === "PAID"
                    ? (Number(balance.paidLeave || 0) - Number(balance.paidLeaveUsed || 0))
                    : (Number(balance.sickLeave || 0) - Number(balance.sickLeaveUsed || 0));

            if (requestedUsed > available) {
                return res.status(400).json({
                    message: `Requested ${numberOfDays} days exceeds available ${type.toLowerCase()} leave balance.`
                });
            }
        }

        const leaveRequest = await LeaveRequest.create({
            employeeId,
            type,
            startDate: start,
            endDate: end,
            numberOfDays,
            reason: reason || null,
            status: "PENDING"
        });

        return res.status(201).json({
            message: "Leave request created successfully.",
            data: leaveRequest
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to create leave request.",
            error: process.env.NODE_ENV === "production" ? undefined : error.message
        });
    }
};

const listLeaveRequests = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "HR_ADMIN") {
            return res.status(403).json({
                message: "Only HR_ADMIN can access all leave requests."
            });
        }

        const filters = normalizeFilters(req.query);
        const requests = await LeaveRequest.find(filters).sort({ startDate: -1, createdAt: -1 });

        return res.status(200).json({
            count: requests.length,
            data: requests
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to fetch leave requests.",
            error: process.env.NODE_ENV === "production" ? undefined : error.message
        });
    }
};

const getLeaveRequestById = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "HR_ADMIN") {
            return res.status(403).json({
                message: "Only HR_ADMIN can view leave request details."
            });
        }

        const leaveRequest = await LeaveRequest.findById(req.params.id);

        if (!leaveRequest) {
            return res.status(404).json({
                message: "Leave request not found."
            });
        }

        return res.status(200).json({
            data: leaveRequest
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to fetch leave request.",
            error: process.env.NODE_ENV === "production" ? undefined : error.message
        });
    }
};

const approveLeaveRequest = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "HR_ADMIN") {
            return res.status(403).json({
                message: "Only HR_ADMIN can approve leave requests."
            });
        }

        const leaveRequest = await LeaveRequest.findById(req.params.id);

        if (!leaveRequest) {
            return res.status(404).json({
                message: "Leave request not found."
            });
        }

        if (leaveRequest.status !== "PENDING") {
            return res.status(409).json({
                message: "This leave request is no longer pending and cannot be approved."
            });
        }

        leaveRequest.status = "APPROVED";
        leaveRequest.reviewedBy = req.user.userId;
        leaveRequest.reviewedAt = new Date();
        leaveRequest.reviewComment = req.body?.comment || null;

        if (leaveRequest.type === "PAID" || leaveRequest.type === "SICK") {
            const year = new Date(leaveRequest.startDate).getFullYear();
            const balance = await getLeaveBalanceForYear(leaveRequest.employeeId, year);

            if (leaveRequest.type === "PAID") {
                balance.paidLeaveUsed = Number(balance.paidLeaveUsed || 0) + Number(leaveRequest.numberOfDays || 0);
            }

            if (leaveRequest.type === "SICK") {
                balance.sickLeaveUsed = Number(balance.sickLeaveUsed || 0) + Number(leaveRequest.numberOfDays || 0);
            }

            await balance.save();
        }

        await leaveRequest.save();

        return res.status(200).json({
            message: "Leave request approved.",
            data: leaveRequest
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to approve leave request.",
            error: process.env.NODE_ENV === "production" ? undefined : error.message
        });
    }
};

const rejectLeaveRequest = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "HR_ADMIN") {
            return res.status(403).json({
                message: "Only HR_ADMIN can reject leave requests."
            });
        }

        const leaveRequest = await LeaveRequest.findById(req.params.id);

        if (!leaveRequest) {
            return res.status(404).json({
                message: "Leave request not found."
            });
        }

        if (leaveRequest.status !== "PENDING") {
            return res.status(409).json({
                message: "This leave request is no longer pending and cannot be rejected."
            });
        }

        leaveRequest.status = "REJECTED";
        leaveRequest.reviewedBy = req.user.userId;
        leaveRequest.reviewedAt = new Date();
        leaveRequest.reviewComment = req.body?.comment || null;

        await leaveRequest.save();

        return res.status(200).json({
            message: "Leave request rejected.",
            data: leaveRequest
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to reject leave request.",
            error: process.env.NODE_ENV === "production" ? undefined : error.message
        });
    }
};

module.exports = {
    getLeaveBalance,
    getMyLeaveRequests,
    createLeaveRequest,
    listLeaveRequests,
    getLeaveRequestById,
    approveLeaveRequest,
    rejectLeaveRequest
};
