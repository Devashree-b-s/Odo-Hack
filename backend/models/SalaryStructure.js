const mongoose = require("mongoose");

const salaryStructureSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },

        monthlyWage: {
            type: Number,
            required: true,
            min: 0
        },

        yearlyWage: {
            type: Number,
            required: true,
            min: 0
        },

        basicSalary: {
            type: Number,
            default: 0,
            min: 0
        },

        hra: {
            type: Number,
            default: 0,
            min: 0
        },

        standardAllowance: {
            type: Number,
            default: 0,
            min: 0
        },

        performanceBonus: {
            type: Number,
            default: 0,
            min: 0
        },

        leaveTravelAllowance: {
            type: Number,
            default: 0,
            min: 0
        },

        fixedAllowance: {
            type: Number,
            default: 0,
            min: 0
        },

        providentFund: {
            type: Number,
            default: 0,
            min: 0
        },

        professionalTax: {
            type: Number,
            default: 0,
            min: 0
        },

        effectiveFrom: {
            type: Date,
            required: true
        },

        effectiveTo: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

salaryStructureSchema.index({ employeeId: 1, effectiveFrom: 1 });

const SalaryStructure = mongoose.model("SalaryStructure", salaryStructureSchema);

module.exports = SalaryStructure;
