const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },

        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12
        },

        year: {
            type: Number,
            required: true
        },

        grossSalary: {
            type: Number,
            default: 0,
            min: 0
        },

        attendanceAdjustment: {
            type: Number,
            default: 0
        },

        deductions: {
            providentFund: {
                type: Number,
                default: 0,
                min: 0
            },
            professionalTax: {
                type: Number,
                default: 0,
                min: 0
            }
        },

        netSalary: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ["DRAFT", "FINALIZED", "PAID"],
            default: "DRAFT"
        },

        generatedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

payrollSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

const Payroll = mongoose.model("Payroll", payrollSchema);

module.exports = Payroll;
