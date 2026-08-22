const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        passwordHash: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["HR_ADMIN", "EMPLOYEE"],
            required: true
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        mustChangePassword: {
            type: Boolean,
            default: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

userSchema.index({ companyId: 1, email: 1 }, { unique: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
