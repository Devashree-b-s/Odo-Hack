const User = require("../models/User");
const Employee = require("../models/Employee");

const editableFields = new Set(["phone", "profilePicture", "privateInfo"]);

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("companyId").lean();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const employee = await Employee.findOne({
            userId: req.user.userId,
            companyId: user.companyId
        })
            .select("employeeCode firstName lastName email phone profilePicture department jobPosition managerId joiningDate status privateInfo bankDetails governmentDetails")
            .lean();

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            profile: {
                id: employee._id,
                employeeCode: employee.employeeCode,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                phone: employee.phone,
                profilePicture: employee.profilePicture,
                department: employee.department,
                jobPosition: employee.jobPosition,
                managerId: employee.managerId,
                joiningDate: employee.joiningDate,
                status: employee.status,
                privateInfo: employee.privateInfo,
                bankDetails: employee.bankDetails,
                governmentDetails: employee.governmentDetails
            }
        });
    } catch (error) {
        console.error("Get my profile error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve profile"
        });
    }
};

const updateMyProfile = async (req, res) => {
    const body = req.body || {};
    const bodyFields = Object.keys(body);

    if (bodyFields.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No editable profile fields provided"
        });
    }

    if (bodyFields.some(field => !editableFields.has(field))) {
        return res.status(400).json({
            success: false,
            message: "One or more fields cannot be updated"
        });
    }

    const update = {};
    if (Object.prototype.hasOwnProperty.call(body, "phone")) {
        if (!isNonEmptyString(body.phone)) {
            return res.status(400).json({
                success: false,
                message: "Phone must be a non-empty string"
            });
        }
        update.phone = body.phone.trim();
    }

    if (Object.prototype.hasOwnProperty.call(body, "profilePicture")) {
        if (!isNonEmptyString(body.profilePicture)) {
            return res.status(400).json({
                success: false,
                message: "Profile picture must be a non-empty string"
            });
        }
        update.profilePicture = body.profilePicture.trim();
    }

    if (Object.prototype.hasOwnProperty.call(body, "privateInfo")) {
        if (!body.privateInfo || typeof body.privateInfo !== "object" || Array.isArray(body.privateInfo)) {
            return res.status(400).json({
                success: false,
                message: "privateInfo must be an object"
            });
        }
        const privateInfoFields = Object.keys(body.privateInfo);
        if (privateInfoFields.length !== 1 || privateInfoFields[0] !== "address") {
            return res.status(400).json({
                success: false,
                message: "One or more fields cannot be updated"
            });
        }
        if (!isNonEmptyString(body.privateInfo.address)) {
            return res.status(400).json({
                success: false,
                message: "Address must be a non-empty string"
            });
        }
        update.privateInfo = { address: body.privateInfo.address.trim() };
    }

    if (Object.keys(update).length === 0) {
        return res.status(400).json({
            success: false,
            message: "No editable profile fields provided"
        });
    }

    try {
        const user = await User.findById(req.user.userId).select("companyId").lean();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const employee = await Employee.findOne({
            userId: req.user.userId,
            companyId: user.companyId
        });
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee profile not found"
            });
        }

        if (update.privateInfo) {
            employee.privateInfo = {
                ...(employee.privateInfo?.toObject?.() || employee.privateInfo || {}),
                address: update.privateInfo.address
            };
            delete update.privateInfo;
        }
        Object.assign(employee, update);
        await employee.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: {
                id: employee._id,
                employeeCode: employee.employeeCode,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                phone: employee.phone,
                profilePicture: employee.profilePicture,
                department: employee.department,
                jobPosition: employee.jobPosition,
                managerId: employee.managerId,
                joiningDate: employee.joiningDate,
                status: employee.status,
                privateInfo: employee.privateInfo
            }
        });
    } catch (error) {
        console.error("Update my profile error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to update profile"
        });
    }
};

module.exports = { getMyProfile, updateMyProfile };
