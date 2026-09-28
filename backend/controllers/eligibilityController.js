const User = require("../models/User");
const Job = require("../models/Job");

const checkEligibility = async (req, res) => {
    try {
        const student = await User.findById(req.user.id);
        const job = await Job.findById(req.params.jobId)
            .populate("companyId", "name");

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        if (!job) {
            return res.status(404).json({
                message: "Placement drive not found"
            });
        }

        const reasons = [];

        // Check CGPA
        const cgpaEligible =
            student.cgpa >= job.minimumCGPA;

        if (!cgpaEligible) {
            reasons.push(
                `Minimum CGPA required is ${job.minimumCGPA}`
            );
        }

        // Check branch
        const branchEligible =
            job.eligibleBranches.includes(student.branch);

        if (!branchEligible) {
            reasons.push(
                `Eligible branches: ${job.eligibleBranches.join(", ")}`
            );
        }

        const eligible =
            cgpaEligible && branchEligible;

        res.json({
            eligible,
            student: {
                name: student.name,
                branch: student.branch,
                cgpa: student.cgpa
            },
            job: {
                title: job.title,
                company: job.companyId.name,
                minimumCGPA: job.minimumCGPA,
                eligibleBranches: job.eligibleBranches
            },
            reasons
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    checkEligibility
};