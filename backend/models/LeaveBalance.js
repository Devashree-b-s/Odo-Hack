const mongoose = require("mongoose");

const leaveBalanceSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },

        year: {
            type: Number,
            required: true
        },

        paidLeave: {
            type: Number,
            default: 0
        },

        sickLeave: {
            type: Number,
            default: 0
        },

        paidLeaveUsed: {
            type: Number,
            default: 0
        },

        sickLeaveUsed: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

leaveBalanceSchema.index({ employeeId: 1, year: 1 }, { unique: true });

const LeaveBalance = mongoose.model("LeaveBalance", leaveBalanceSchema);

module.exports = LeaveBalance;
