const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createJob,
    getJobs
} = require("../controllers/jobController");


router.post(
    "/",
    protect,
    authorize("admin"),
    createJob
);


router.get(
    "/",
    protect,
    getJobs
);


module.exports = router;