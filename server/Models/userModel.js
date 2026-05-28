import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    name: {
      type: String,
      required: true,
      trim:true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase:true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    rollNumber: {
      type: String,
    },

    branch: {
      type: String,
    },

    cgpa: {
      type: Number,
    },

    backlogs: {
      type: Number,
      default: 0,
    },

    skills: {
      type: [String],
      default: [],
    },
    isActive : {
      type: Boolean,
      default: true
    },
    resume: {
      type: String,
      default: "",
    },
    linkedIn: {
      type: String,
      default: "",
    },
    gitHub: {
      type: String,
      default: "",
    },
    portfolio: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    placementStatus: {
      type: String,
      enum: [
          "unplaced",
          "placed",
          "internship"
      ],
      default: "unplaced",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;