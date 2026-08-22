const Attendance = require("../models/Attendance");
const {
    REQUIRED_WORK_HOURS,
    toStartOfDay,
    calculateWorkHours,
    calculateExtraHours,
    buildStatusFromWorkHours,
    buildDateFilter
} = require("../services/attendanceService");

const getCurrentEmployee = (req) => {
    const employeeId = req.user?.employeeId;

    if (!employeeId) {
        const error = new Error("req.user.employeeId is required for attendance operations.");
        error.statusCode = 401;
        throw error;
    }

    return employeeId;
};

const getAttendanceFilters = (reqQuery = {}) => {
    const { date, month, year, employeeId } = reqQuery;
    const filters = {};

    if (employeeId) {
        filters.employeeId = employeeId;
    }

    Object.assign(filters, buildDateFilter({ date, month, year }));
    return filters;
};

const checkInAttendance = async (req, res) => {
    try {
        const employeeId = getCurrentEmployee(req);
        const now = new Date();
        const attendanceDate = toStartOfDay(now);

        const existingAttendance = await Attendance.findOne({ employeeId, date: attendanceDate });

        if (existingAttendance) {
            return res.status(409).json({
                message: "Duplicate attendance check-in for the same employee and date."
            });
        }

        const attendance = await Attendance.create({
            employeeId,
            date: attendanceDate,
            checkIn: now,
            checkOut: null,
            workHours: 0,
            extraHours: 0,
            status: "PRESENT"
        });

        return res.status(201).json({
            message: "Check-in successful.",
            data: attendance
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to check in.",
            error: process.env.NODE_ENV === "production" ? undefined : error.message
        });
    }
};

const checkOutAttendance = async (req, res) => {
    try {
        const employeeId = getCurrentEmployee(req);
        const today = toStartOfDay(new Date());

        const attendance = await Attendance.findOne({ employeeId, date: today });

        if (!attendance) {
            return res.status(404).json({
                message: "No check-in found for today. Please check in before checking out."
            });
        }

        if (attendance.checkOut) {
            return res.status(409).json({
                message: "Duplicate check-out for the same attendance record."
            });
        }

        const checkOut = new Date();
        const workHours = calculateWorkHours(attendance.checkIn, checkOut);
        const extraHours = calculateExtraHours(workHours);
        const status = buildStatusFromWorkHours(workHours);

        attendance.checkOut = checkOut;
        attendance.workHours = workHours;
        attendance.extraHours = extraHours;
        attendance.status = status;

        await attendance.save();

        return res.status(200).json({
            message: "Check-out successful.",
            data: attendance
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to check out.",
            error: process.env.NODE_ENV === "production" ? undefined : error.message
        });
    }
};

const getMyAttendance = async (req, res) => {
    try {
        const employeeId = getCurrentEmployee(req);
        const filters = getAttendanceFilters(req.query);

        const attendance = await Attendance.find({ employeeId, ...filters }).sort({ date: -1, checkIn: -1 });

        return res.status(200).json({
            count: attendance.length,
            data: attendance
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to fetch attendance.",
            error: process.env.NODE_ENV === "production" ? undefined : error.message
        });
    }
};

const getAllAttendance = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "HR_ADMIN") {
            return res.status(403).json({
                message: "Only HR_ADMIN can access all attendance records."
            });
        }

        const filters = getAttendanceFilters(req.query);
        const attendance = await Attendance.find(filters).sort({ date: -1, employeeId: 1, checkIn: -1 });

        return res.status(200).json({
            count: attendance.length,
            data: attendance
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to fetch attendance.",
            error: process.env.NODE_ENV === "production" ? undefined : error.message
        });
    }
};

const getAttendanceByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const currentEmployeeId = req.user?.employeeId;

        if (req.user?.role !== "HR_ADMIN" && currentEmployeeId?.toString() !== employeeId.toString()) {
            return res.status(403).json({
                message: "Employees cannot access another employee's attendance records."
            });
        }

        const filters = getAttendanceFilters({ ...req.query, employeeId });
        const attendance = await Attendance.find(filters).sort({ date: -1, checkIn: -1 });

        return res.status(200).json({
            count: attendance.length,
            data: attendance
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Failed to fetch employee attendance.",
            error: process.env.NODE_ENV === "production" ? undefined : error.message
        });
    }
};

module.exports = {
    checkInAttendance,
    checkOutAttendance,
    getMyAttendance,
    getAllAttendance,
    getAttendanceByEmployee,
    REQUIRED_WORK_HOURS
};
