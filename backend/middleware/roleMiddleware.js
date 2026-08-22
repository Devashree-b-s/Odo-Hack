const requireRole = (requiredRole) => (req, res, next) => {
    if (req.user?.role !== requiredRole) {
        return res.status(403).json({
            success: false,
            message: "Forbidden"
        });
    }

    return next();
};

module.exports = requireRole;
