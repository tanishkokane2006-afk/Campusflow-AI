const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    },

    skills: {
        type: [String],
        default: []
    },

    education: {
        type: String
    },

    phone: {
        type: String
    },

    branch: {
        type: String
    },

    cgpa: {
        type: Number
    },

    graduationYear: {
        type: Number
    },

    resume: {
        type: String
    },

    placementStatus: {
        type: String,
        enum: ["Not Placed", "Placed"],
        default: "Not Placed"
    }
});

module.exports = mongoose.model("User", userSchema);