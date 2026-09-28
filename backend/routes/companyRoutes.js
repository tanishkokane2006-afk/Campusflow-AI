const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    createCompany,
    getCompanies
} = require("../controllers/companyController");


router.post(
    "/",
    protect,
    authorize("admin"),
    createCompany
);


router.get(
    "/",
    protect,
    getCompanies
);


module.exports = router;