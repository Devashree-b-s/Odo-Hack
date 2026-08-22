const express = require("express");
const { login, changePassword, getMe, logout } = require("../controllers/authController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/change-password", authenticate, changePassword);
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

module.exports = router;
