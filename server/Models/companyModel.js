import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    packageOffered: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    minCGPA: {
      type: Number,
      required: true,
    },

    allowedBranches: {
      type: [String],
      required: true,
    },

    lastDate: {
      type: Date,
      required: true,
    },

    driveDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    // ==================================
    // COMPANY LOGO
    // ==================================
    logo: {
      type: String,
      default: "",
    },

    // ==================================
    // STATUS
    // ==================================
    status: {
      type: String,
      enum: [
        "ACTIVE",
        "PENDING",
        "CLOSED",
      ],
      default: "ACTIVE",
    },

    // ==================================
    // TOTAL APPLICATIONS
    // ==================================
    totalApplications: {
      type: Number,
      default: 0,
    },

    // ==================================
    // DELETED
    // ==================================
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Company =
  mongoose.models.Company ||
  mongoose.model(
    "Company",
    companySchema
  );

export default Company;