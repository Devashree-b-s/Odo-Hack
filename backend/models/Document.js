const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: [
                "RESUME",
                "ID_DOCUMENT",
                "CERTIFICATE",
                "OFFER_LETTER",
                "OTHER"
            ],
            required: true
        },

        fileUrl: {
            type: String,
            required: true
        },

        uploadedAt: {
            type: Date,
            default: Date.now
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
