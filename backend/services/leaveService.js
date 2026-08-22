const LeaveBalance = require("../models/LeaveBalance");

const getCurrentYear = (date = new Date()) => new Date(date).getFullYear();

const getDatePart = (value) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
};

const calculateNumberOfDays = (startDate, endDate) => {
    const start = getDatePart(startDate);
    const end = getDatePart(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
};

const getLeaveBalanceForYear = async (employeeId, year = getCurrentYear()) => {
    let balance = await LeaveBalance.findOne({ employeeId, year });

    if (!balance) {
        balance = await LeaveBalance.create({
            employeeId,
            year,
            paidLeave: 0,
            sickLeave: 0,
            paidLeaveUsed: 0,
            sickLeaveUsed: 0
        });
    }

    return balance;
};

const buildLeaveBalanceSummary = (balance) => {
    const paidLeave = Number(balance.paidLeave || 0);
    const paidLeaveUsed = Number(balance.paidLeaveUsed || 0);
    const sickLeave = Number(balance.sickLeave || 0);
    const sickLeaveUsed = Number(balance.sickLeaveUsed || 0);

    return {
        paidLeave,
        paidLeaveUsed,
        paidLeaveRemaining: paidLeave - paidLeaveUsed,
        sickLeave,
        sickLeaveUsed,
        sickLeaveRemaining: sickLeave - sickLeaveUsed
    };
};

const getLeaveBalanceSummaryForYear = async (employeeId, year = getCurrentYear()) => {
    const balance = await getLeaveBalanceForYear(employeeId, year);
    return buildLeaveBalanceSummary(balance);
};

const normalizeFilters = ({ status, type, year, employeeId }) => {
    const filters = {};

    if (employeeId) {
        filters.employeeId = employeeId;
    }

    if (status) {
        filters.status = status;
    }

    if (type) {
        filters.type = type;
    }

    if (year) {
        const start = new Date(Date.UTC(Number(year), 0, 1));
        const end = new Date(Date.UTC(Number(year) + 1, 0, 1));
        filters.startDate = { $gte: start, $lt: end };
    }

    return filters;
};

module.exports = {
    getCurrentYear,
    getDatePart,
    calculateNumberOfDays,
    getLeaveBalanceForYear,
    buildLeaveBalanceSummary,
    getLeaveBalanceSummaryForYear,
    normalizeFilters
};
