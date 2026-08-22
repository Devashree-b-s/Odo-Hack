const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

const authenticate = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const [scheme, token] = authorization ? authorization.split(" ") : [];

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(401).json({
            success: false,
            message: "Authentication is not configured"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.userId || !decoded.role) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }

        const user = await User.findById(decoded.userId)
            .select("companyId role")
            .lean();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }

        let employeeId = null;
        if (user.role === "EMPLOYEE") {
            const employee = await Employee.findOne({
                userId: user._id,
                companyId: user.companyId
            })
                .select("_id")
                .lean();

            if (!employee) {
                return res.status(401).json({
                    success: false,
                    message: "Employee profile not found"
                });
            }

            employeeId = employee._id;
        }

        req.user = {
            userId: user._id,
            employeeId,
            companyId: user.companyId,
            role: user.role
        };

        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid authentication token"
        });
    }
};

module.exports = authenticate;
