import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "Round 1",
                "Round 2",
                "HR Round",
                "Selected",
                "Rejected"
            ],
        default: "Applied"
        },
        remarks: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

export default Application;