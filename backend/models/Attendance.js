const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        checkIn: {
            type: Date,
            default: null
        },

        checkOut: {
            type: Date,
            default: null
        },

        workHours: {
            type: Number,
            default: 0
        },

        extraHours: {
            type: Number,
            default: 0
        },

        status: {
            type: String,
            enum: ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE"],
            default: "ABSENT"
        }
    },
    {
        timestamps: true
    }
);

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
