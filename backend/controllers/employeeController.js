const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Company = require("../models/Company");
const User = require("../models/User");
const Employee = require("../models/Employee");
const { generateEmployeeCode } = require("../services/employeeIdService");

function isValidDate(value) {
    return value && !Number.isNaN(new Date(value).getTime());
}

function createTemporaryPassword() {
    return crypto.randomBytes(9).toString("base64url");
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeOptionalText(value) {
    return value === null ? null : String(value).trim();
}

function normalizeNestedInfo(value, fields) {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return null;

    return fields.reduce((result, field) => {
        if (Object.prototype.hasOwnProperty.call(value, field)) {
            result[field] = normalizeOptionalText(value[field]);
        }
        return result;
    }, {});
}

const getEmployees = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("companyId role");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const { search, department, status } = req.query;
        if (status && !["ACTIVE", "INACTIVE"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid employee status"
            });
        }

        const query = { companyId: user.companyId };
        if (search?.trim()) {
            const searchPattern = new RegExp(escapeRegExp(search.trim()), "i");
            query.$or = [
                { firstName: searchPattern },
                { lastName: searchPattern },
                { employeeCode: searchPattern },
                { email: searchPattern }
            ];
        }
        if (department !== undefined) query.department = department.trim();
        if (status) query.status = status;

        const employees = await Employee.find(query)
            .select("employeeCode firstName lastName email phone profilePicture department jobPosition managerId joiningDate status")
            .sort({ firstName: 1, lastName: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            employees: employees.map(employee => ({
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
                status: employee.status
            }))
        });
    } catch (error) {
        console.error("Get employees error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve employees"
        });
    }
};

const getEmployeeById = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID"
        });
    }

    try {
        const user = await User.findById(req.user.userId).select("companyId");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const employee = await Employee.findOne({
            _id: req.params.id,
            companyId: user.companyId
        })
            .select("employeeCode firstName lastName email phone profilePicture department jobPosition managerId joiningDate status privateInfo bankDetails governmentDetails")
            .lean();

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            employee: {
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
        console.error("Get employee error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve employee"
        });
    }
};

const updateEmployee = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID"
        });
    }

    const body = req.body || {};
    const allowedFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "profilePicture",
        "department",
        "jobPosition",
        "managerId",
        "joiningDate",
        "privateInfo",
        "bankDetails",
        "governmentDetails"
    ];
    const requestedFields = Object.keys(body).filter(field => allowedFields.includes(field));
    const invalidNestedFields = [
        ["privateInfo", ["dateOfBirth", "address", "nationality", "gender", "personalEmail", "maritalStatus"]],
        ["bankDetails", ["accountNumber", "bankName", "ifsc"]],
        ["governmentDetails", ["uan", "pan"]]
    ];

    for (const [field, nestedFields] of invalidNestedFields) {
        if (Object.prototype.hasOwnProperty.call(body, field)) {
            if (normalizeNestedInfo(body[field], nestedFields) === null) {
                return res.status(400).json({
                    success: false,
                    message: `${field} must be an object`
                });
            }
        }
    }

    const update = {};
    for (const field of requestedFields) {
        if (["firstName", "lastName", "email"].includes(field)) {
            update[field] = String(body[field]).trim();
        } else if (["phone", "profilePicture", "department", "jobPosition"].includes(field)) {
            update[field] = normalizeOptionalText(body[field]);
        } else if (field === "joiningDate") {
            update[field] = body[field];
        } else if (field === "privateInfo") {
            update[field] = normalizeNestedInfo(body[field], invalidNestedFields[0][1]);
        } else if (field === "bankDetails") {
            update[field] = normalizeNestedInfo(body[field], invalidNestedFields[1][1]);
        } else if (field === "governmentDetails") {
            update[field] = normalizeNestedInfo(body[field], invalidNestedFields[2][1]);
        } else {
            update[field] = body[field];
        }
    }

    if (Object.prototype.hasOwnProperty.call(update, "email")) {
        update.email = update.email.toLowerCase();
    }
    if (Object.prototype.hasOwnProperty.call(update, "joiningDate") && !isValidDate(update.joiningDate)) {
        return res.status(400).json({
            success: false,
            message: "Joining date must be a valid date"
        });
    }
    if (Object.prototype.hasOwnProperty.call(update, "managerId") && update.managerId !== null && !mongoose.isValidObjectId(update.managerId)) {
        return res.status(400).json({
            success: false,
            message: "managerId must be a valid Employee ID"
        });
    }

    const session = await mongoose.startSession();
    try {
        let result;
        await session.withTransaction(async () => {
            const hrUser = await User.findById(req.user.userId).session(session);
            if (!hrUser) throw Object.assign(new Error("User not found"), { statusCode: 401 });

            const employee = await Employee.findOne({
                _id: req.params.id,
                companyId: hrUser.companyId
            }).session(session);
            if (!employee) throw Object.assign(new Error("Employee not found"), { statusCode: 404 });

            const nextFirstName = update.firstName ?? employee.firstName;
            const nextLastName = update.lastName ?? employee.lastName;
            const nextEmail = update.email ?? employee.email;
            const nextJoiningDate = update.joiningDate ? new Date(update.joiningDate) : employee.joiningDate;
            if (!String(nextFirstName).trim() || !String(nextLastName).trim() || !String(nextEmail).trim() || !isValidDate(nextJoiningDate)) {
                throw Object.assign(new Error("firstName, lastName, email, and joiningDate are required"), { statusCode: 400 });
            }

            if (update.managerId !== undefined) {
                if (update.managerId !== null && update.managerId.toString() === employee._id.toString()) {
                    throw Object.assign(new Error("An employee cannot be their own manager"), { statusCode: 400 });
                }
                if (update.managerId !== null) {
                    const manager = await Employee.findOne({ _id: update.managerId, companyId: hrUser.companyId }).session(session);
                    if (!manager) throw Object.assign(new Error("managerId must refer to an Employee in the same company"), { statusCode: 400 });
                }
            }

            const emailChanged = nextEmail.toLowerCase() !== employee.email;
            let linkedUser;
            if (emailChanged) {
                linkedUser = await User.findOne({
                    companyId: hrUser.companyId,
                    email: nextEmail.toLowerCase(),
                    _id: { $ne: employee.userId }
                }).session(session);
                if (linkedUser) throw Object.assign(new Error("An account with this email already exists"), { statusCode: 409 });

                linkedUser = await User.findById(employee.userId).session(session);
                if (!linkedUser) throw Object.assign(new Error("Linked user account not found"), { statusCode: 500 });
            }

            if (Object.prototype.hasOwnProperty.call(update, "joiningDate")) update.joiningDate = nextJoiningDate;
            Object.assign(employee, update);
            await employee.save({ session });
            if (emailChanged) {
                linkedUser.email = nextEmail.toLowerCase();
                await linkedUser.save({ session });
            }
            result = employee;
        });

        return res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            employee: {
                id: result._id,
                employeeCode: result.employeeCode,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                phone: result.phone,
                profilePicture: result.profilePicture,
                department: result.department,
                jobPosition: result.jobPosition,
                managerId: result.managerId,
                joiningDate: result.joiningDate,
                status: result.status,
                privateInfo: result.privateInfo,
                bankDetails: result.bankDetails,
                governmentDetails: result.governmentDetails
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        console.error("Update employee error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to update employee"
        });
    } finally {
        await session.endSession();
    }
};

const updateEmployeeStatus = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee ID"
        });
    }

    const { status } = req.body || {};
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid employee status"
        });
    }

    try {
        const user = await User.findById(req.user.userId).select("companyId");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        const employee = await Employee.findOneAndUpdate(
            { _id: req.params.id, companyId: user.companyId },
            { $set: { status } },
            { returnDocument: "after", runValidators: true }
        ).select("employeeCode firstName lastName status").lean();

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Employee status updated successfully",
            employee: {
                id: employee._id,
                employeeCode: employee.employeeCode,
                firstName: employee.firstName,
                lastName: employee.lastName,
                status: employee.status
            }
        });
    } catch (error) {
        console.error("Update employee status error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to update employee status"
        });
    }
};

const createEmployee = async (req, res) => {
    const { firstName, lastName, email, phone, department, jobPosition, managerId, joiningDate } = req.body;

    if (!firstName || !lastName || !email || !joiningDate) {
        return res.status(400).json({
            success: false,
            message: "First name, last name, email, and joining date are required"
        });
    }

    if (!isValidDate(joiningDate)) {
        return res.status(400).json({
            success: false,
            message: "Joining date must be a valid date"
        });
    }

    if (managerId !== undefined && managerId !== null && !mongoose.isValidObjectId(managerId)) {
        return res.status(400).json({
            success: false,
            message: "managerId must be a valid Employee ID"
        });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedFirstName = String(firstName).trim();
    const normalizedLastName = String(lastName).trim();
    if (!normalizedFirstName || !normalizedLastName || !normalizedEmail) {
        return res.status(400).json({
            success: false,
            message: "First name, last name, email, and joining date are required"
        });
    }

    const session = await mongoose.startSession();
    let temporaryPassword;

    try {
        let result;
        await session.withTransaction(async () => {
            const hrUser = await User.findById(req.user.userId).session(session);
            if (!hrUser || hrUser.role !== "HR_ADMIN") {
                throw Object.assign(new Error("HR user not found"), { statusCode: 401 });
            }

            const company = await Company.findById(hrUser.companyId).session(session);
            if (!company) {
                throw Object.assign(new Error("Company not found"), { statusCode: 404 });
            }

            if (await User.exists({ companyId: company._id, email: normalizedEmail }).session(session)) {
                throw Object.assign(new Error("An account with this email already exists"), { statusCode: 409 });
            }

            if (managerId !== undefined && managerId !== null) {
                const manager = await Employee.findOne({ _id: managerId, companyId: company._id }).session(session);
                if (!manager) {
                    throw Object.assign(new Error("managerId must refer to an Employee in the same company"), { statusCode: 400 });
                }
            }

            const joiningDateValue = new Date(joiningDate);
            const employeeCode = await generateEmployeeCode({
                company,
                firstName: normalizedFirstName,
                lastName: normalizedLastName,
                joiningDate: joiningDateValue,
                session
            });
            temporaryPassword = createTemporaryPassword();
            const passwordHash = await bcrypt.hash(temporaryPassword, 10);

            const [user] = await User.create([{
                companyId: company._id,
                email: normalizedEmail,
                passwordHash,
                role: "EMPLOYEE",
                isEmailVerified: false,
                mustChangePassword: true,
                isActive: true
            }], { session });

            const [employee] = await Employee.create([{
                companyId: company._id,
                userId: user._id,
                employeeCode,
                firstName: normalizedFirstName,
                lastName: normalizedLastName,
                email: normalizedEmail,
                phone: phone ?? null,
                department: department ?? null,
                jobPosition: jobPosition ?? null,
                managerId: managerId ?? null,
                joiningDate: joiningDateValue,
                status: "ACTIVE"
            }], { session });

            result = { user, employee };
        });

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            employee: {
                id: result.employee._id,
                employeeCode: result.employee.employeeCode,
                firstName: result.employee.firstName,
                lastName: result.employee.lastName,
                email: result.employee.email,
                department: result.employee.department,
                jobPosition: result.employee.jobPosition
            },
            credentials: {
                email: result.user.email,
                temporaryPassword
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        console.error("Create employee error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Unable to create employee"
        });
    } finally {
        await session.endSession();
    }
};

module.exports = { createEmployee, getEmployees, getEmployeeById, updateEmployee, updateEmployeeStatus };
