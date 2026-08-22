const express = require("express");
const { getSalaryByEmployee, updateSalaryByEmployee } = require("../controllers/salaryController");

const router = express.Router();

router.get("/:employeeId", getSalaryByEmployee);
router.put("/:employeeId", updateSalaryByEmployee);

module.exports = router;
