const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
    createPayroll,
    listPayroll,
    getPayrollByEmployee,
    getPayrollByEmployeeYearMonth,
    getMyPayroll,
    getMyPayrollByYearMonth
} = require("../controllers/payrollController");

const router = express.Router();

router.post("/generate", authenticate, requireRole("HR_ADMIN"), createPayroll);
router.get("/me/:year/:month", authenticate, requireRole("EMPLOYEE"), getMyPayrollByYearMonth);
router.get("/me", authenticate, requireRole("EMPLOYEE"), getMyPayroll);
router.get("/:employeeId/:year/:month", authenticate, requireRole("HR_ADMIN"), getPayrollByEmployeeYearMonth);
router.get("/:employeeId", authenticate, requireRole("HR_ADMIN"), getPayrollByEmployee);
router.get("/", authenticate, requireRole("HR_ADMIN"), listPayroll);

module.exports = router;
