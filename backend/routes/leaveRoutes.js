const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const {
    getLeaveBalance,
    getMyLeaveRequests,
    createLeaveRequest,
    listLeaveRequests,
    getLeaveRequestById,
    approveLeaveRequest,
    rejectLeaveRequest
} = require("../controllers/leaveController");

const router = express.Router();

router.get("/balance", authenticate, requireRole("EMPLOYEE"), getLeaveBalance);
router.get("/requests/me", authenticate, requireRole("EMPLOYEE"), getMyLeaveRequests);
router.post("/requests", authenticate, requireRole("EMPLOYEE"), createLeaveRequest);
router.get("/requests", authenticate, requireRole("HR_ADMIN"), listLeaveRequests);
router.get("/requests/:id", authenticate, requireRole("HR_ADMIN"), getLeaveRequestById);
router.patch("/requests/:id/approve", authenticate, requireRole("HR_ADMIN"), approveLeaveRequest);
router.patch("/requests/:id/reject", authenticate, requireRole("HR_ADMIN"), rejectLeaveRequest);

module.exports = router;
