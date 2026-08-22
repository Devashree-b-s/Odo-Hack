const express = require("express");
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

router.get("/balance", getLeaveBalance);
router.get("/requests/me", getMyLeaveRequests);
router.post("/requests", createLeaveRequest);
router.get("/requests", listLeaveRequests);
router.get("/requests/:id", getLeaveRequestById);
router.patch("/requests/:id/approve", approveLeaveRequest);
router.patch("/requests/:id/reject", rejectLeaveRequest);

module.exports = router;
