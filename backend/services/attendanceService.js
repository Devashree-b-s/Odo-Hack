const REQUIRED_WORK_HOURS = 8;

const toStartOfDay = (value = new Date()) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
};

const calculateWorkHours = (checkIn, checkOut) => {
    if (!(checkIn instanceof Date) || !(checkOut instanceof Date)) {
        return 0;
    }

    const diffMs = Math.max(checkOut.getTime() - checkIn.getTime(), 0);
    return Number((diffMs / (1000 * 60 * 60)).toFixed(2));
};

const calculateExtraHours = (workHours) => Math.max(workHours - REQUIRED_WORK_HOURS, 0);

const buildStatusFromWorkHours = (workHours) => {
    if (workHours >= REQUIRED_WORK_HOURS) {
        return "PRESENT";
    }

    if (workHours > 0) {
        return "HALF_DAY";
    }

    return "ABSENT";
};

const buildDateFilter = ({ date, month, year }) => {
    if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        return {
            date: {
                $gte: start,
                $lt: end
            }
        };
    }

    if (month || year) {
        const targetYear = Number(year || new Date().getFullYear());
        const targetMonth = Number(month || 1);

        const start = new Date(targetYear, targetMonth - 1, 1);
        const end = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

        return {
            date: {
                $gte: start,
                $lte: end
            }
        };
    }

    return {};
};

module.exports = {
    REQUIRED_WORK_HOURS,
    toStartOfDay,
    calculateWorkHours,
    calculateExtraHours,
    buildStatusFromWorkHours,
    buildDateFilter
};
