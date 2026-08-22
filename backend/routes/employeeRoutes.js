const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const { createEmployee, getEmployees, getEmployeeById, updateEmployee, updateEmployeeStatus } = require("../controllers/employeeController");

const router = express.Router();

router.get("/", authenticate, requireRole("HR_ADMIN"), getEmployees);
router.post("/", authenticate, requireRole("HR_ADMIN"), createEmployee);
router.get("/:id", authenticate, requireRole("HR_ADMIN"), getEmployeeById);
router.put("/:id", authenticate, requireRole("HR_ADMIN"), updateEmployee);
router.patch("/:id/status", authenticate, requireRole("HR_ADMIN"), updateEmployeeStatus);

module.exports = router;
