const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    applyForJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus
} = require("../controllers/applicationController");


// Student applies for a job
router.post(
    "/",
    protect,
    authorize("student"),
    applyForJob
);


// Student views their applications
router.get(
    "/my",
    protect,
    authorize("student"),
    getMyApplications
);


// Admin views applicants for a particular job
router.get(
    "/job/:jobId",
    protect,
    authorize("admin"),
    getJobApplications
);


// Admin updates application status
router.put(
    "/:id/status",
    protect,
    authorize("admin"),
    updateApplicationStatus
);


module.exports = router;