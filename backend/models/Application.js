const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },

    status: {
        type: String,
        enum: [
            "Applied",
            "Shortlisted",
            "Interview",
            "Selected",
            "Rejected"
        ],
        default: "Applied"
    },

    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Application", applicationSchema);