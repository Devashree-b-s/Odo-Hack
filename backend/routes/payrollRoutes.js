const express = require("express");
const {
    createPayroll,
    listPayroll,
    getPayrollByEmployee,
    getPayrollByEmployeeYearMonth,
    getMyPayroll,
    getMyPayrollByYearMonth
} = require("../controllers/payrollController");

const router = express.Router();

router.post("/generate", createPayroll);
router.get("/me/:year/:month", getMyPayrollByYearMonth);
router.get("/me", getMyPayroll);
router.get("/:employeeId/:year/:month", getPayrollByEmployeeYearMonth);
router.get("/:employeeId", getPayrollByEmployee);
router.get("/", listPayroll);

module.exports = router;
