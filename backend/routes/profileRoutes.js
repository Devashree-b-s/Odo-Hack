const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const { getMyProfile, updateMyProfile } = require("../controllers/profileController");

const router = express.Router();

router.get("/me", authenticate, getMyProfile);
router.patch("/me", authenticate, updateMyProfile);

module.exports = router;
