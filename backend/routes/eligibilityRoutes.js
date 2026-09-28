const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    checkEligibility
} = require("../controllers/eligibilityController");


router.get(
    "/:jobId",
    protect,
    authorize("student"),
    checkEligibility
);


module.exports = router;