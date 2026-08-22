const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    try {
        if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
            throw new Error("JWT_SECRET and JWT_EXPIRES_IN must be configured");
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: "Account is inactive"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                mustChangePassword: user.mustChangePassword
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Authentication service is unavailable"
        });
    }
};

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Current password and new password are required"
        });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({
            success: false,
            message: "New password must be at least 8 characters"
        });
    }

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not authorized"
            });
        }

        const passwordMatches = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        user.mustChangePassword = false;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.error("Change password error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Authentication service is unavailable"
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                mustChangePassword: user.mustChangePassword,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error("Get current user error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Authentication service is unavailable"
        });
    }
};

const logout = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });
};

module.exports = { login, changePassword, getMe, logout };
