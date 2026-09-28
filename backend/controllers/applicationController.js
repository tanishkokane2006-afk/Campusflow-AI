const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");


// Student applies for a job
const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Placement drive not found"
            });
        }

        const student = await User.findById(req.user.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Check CGPA eligibility
        if (student.cgpa < job.minimumCGPA) {
            return res.status(400).json({
                message: `Not eligible. Minimum CGPA required is ${job.minimumCGPA}`
            });
        }

        // Check branch eligibility
        if (!job.eligibleBranches.includes(student.branch)) {
            return res.status(400).json({
                message: `Not eligible. Eligible branches are: ${job.eligibleBranches.join(", ")}`
            });
        }

        // Check duplicate application
        const existingApplication = await Application.findOne({
            studentId: req.user.id,
            jobId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "Already applied for this job"
            });
        }

        // Create application
        const application = await Application.create({
            studentId: req.user.id,
            jobId
        });

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Student views their applications
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            studentId: req.user.id
        })
        .populate(
            "jobId",
            "title location salary"
        )
        .sort({ appliedAt: -1 });

        res.json(applications);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Admin views applicants for a particular job
const getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;

        const applications = await Application.find({
            jobId
        })
        .populate(
            "studentId",
            "name email branch cgpa graduationYear skills"
        )
        .populate(
            "jobId",
            "title location salary minimumCGPA"
        )
        .sort({ appliedAt: -1 });

        res.json(applications);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "Applied",
            "Shortlisted",
            "Interview",
            "Selected",
            "Rejected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid application status"
            });
        }

        const application = await Application.findById(
            req.params.id
        );

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        application.status = status;

        await application.save();

        res.json({
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus
};