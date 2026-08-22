const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
    checkInAttendance,
    checkOutAttendance,
    getMyAttendance,
    getAllAttendance,
    getAttendanceByEmployee
} = require("../controllers/attendanceController");

const router = express.Router();

router.post("/check-in", authenticate, requireRole("EMPLOYEE"), checkInAttendance);
router.post("/check-out", authenticate, requireRole("EMPLOYEE"), checkOutAttendance);
router.get("/me", authenticate, requireRole("EMPLOYEE"), getMyAttendance);
router.get("/", authenticate, requireRole("HR_ADMIN"), getAllAttendance);
router.get("/:employeeId", authenticate, requireRole("HR_ADMIN"), getAttendanceByEmployee);

module.exports = router;
