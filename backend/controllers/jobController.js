const Job = require("../models/Job");

const createJob = async (req, res) => {
    try {
        const {
            companyId,
            title,
            description,
            skills,
            location,
            salary,
            minimumCGPA,
            eligibleBranches,
            deadline
        } = req.body;

        if (
            !companyId ||
            !title ||
            !description ||
            !location ||
            minimumCGPA === undefined ||
            !eligibleBranches ||
            !deadline
        ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const job = await Job.create({
            companyId,
            title,
            description,
            skills,
            location,
            salary,
            minimumCGPA,
            eligibleBranches,
            deadline
        });

        res.status(201).json({
            message: "Placement drive created successfully",
            job
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate("companyId", "name industry website")
            .sort({ createdAt: -1 });

        res.json(jobs);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createJob,
    getJobs
};