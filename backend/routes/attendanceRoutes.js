const express = require("express");
const {
    checkInAttendance,
    checkOutAttendance,
    getMyAttendance,
    getAllAttendance,
    getAttendanceByEmployee
} = require("../controllers/attendanceController");

const router = express.Router();

router.post("/check-in", checkInAttendance);
router.post("/check-out", checkOutAttendance);
router.get("/me", getMyAttendance);
router.get("/", getAllAttendance);
router.get("/:employeeId", getAttendanceByEmployee);

module.exports = router;
