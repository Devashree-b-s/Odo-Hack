const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { getSalaryByEmployee, updateSalaryByEmployee } = require("../controllers/salaryController");

const router = express.Router();

router.get("/:employeeId", authenticate, requireRole("HR_ADMIN"), getSalaryByEmployee);
router.put("/:employeeId", authenticate, requireRole("HR_ADMIN"), updateSalaryByEmployee);

module.exports = router;
