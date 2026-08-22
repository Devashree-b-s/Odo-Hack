const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
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

        req.user = {
            userId: decoded.userId,
            role: decoded.role
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
