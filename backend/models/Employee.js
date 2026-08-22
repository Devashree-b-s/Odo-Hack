const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        employeeCode: {
            type: String,
            required: true,
            trim: true
        },

        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            trim: true,
            default: null
        },

        profilePicture: {
            type: String,
            default: null
        },

        department: {
            type: String,
            trim: true,
            default: null
        },

        jobPosition: {
            type: String,
            trim: true,
            default: null
        },

        managerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            default: null
        },

        joiningDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
        },

        privateInfo: {
            dateOfBirth: {
                type: Date,
                default: null
            },
            address: {
                type: String,
                default: null
            },
            nationality: {
                type: String,
                default: null
            },
            gender: {
                type: String,
                default: null
            },
            personalEmail: {
                type: String,
                default: null
            },
            maritalStatus: {
                type: String,
                default: null
            }
        },

        bankDetails: {
            accountNumber: {
                type: String,
                default: null
            },
            bankName: {
                type: String,
                default: null
            },
            ifsc: {
                type: String,
                default: null
            }
        },

        governmentDetails: {
            uan: {
                type: String,
                default: null
            },
            pan: {
                type: String,
                default: null
            }
        }
    },
    {
        timestamps: true
    }
);

employeeSchema.index({ companyId: 1, employeeCode: 1 }, { unique: true });
employeeSchema.index({ userId: 1 }, { unique: true, sparse: true });

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
