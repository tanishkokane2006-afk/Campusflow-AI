const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Company = require("./models/Company");
const Job = require("./models/Job");
const Application = require("./models/Application");

dotenv.config();

const resetDatabase = async () => {
    try {
        await connectDB();
        console.log("Connected to database. Starting fresh portal reset...");

        // Delete all records from all collections
        const userResult = await User.deleteMany({});
        const companyResult = await Company.deleteMany({});
        const jobResult = await Job.deleteMany({});
        const appResult = await Application.deleteMany({});

        console.log(`\nPortal Cleanup Summary:`);
        console.log(`- Removed ${userResult.deletedCount} User profiles`);
        console.log(`- Removed ${companyResult.deletedCount} Companies`);
        console.log(`- Removed ${jobResult.deletedCount} Placement drives`);
        console.log(`- Removed ${appResult.deletedCount} Applications`);

        console.log("\nFresh Portal initialized successfully! All seed data removed.");
        process.exit(0);
    } catch (error) {
        console.error("Database Reset Error:", error);
        process.exit(1);
    }
};

resetDatabase();
