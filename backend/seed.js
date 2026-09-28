const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const connectDB = require("./config/db");
const User = require("./models/User");
const Company = require("./models/Company");
const Job = require("./models/Job");

dotenv.config();

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log("Connected to database for seeding...");

        // 1. Seed Student User
        const studentPassword = await bcrypt.hash("password123", 10);
        let student = await User.findOne({ email: "student@example.com" });
        if (!student) {
            student = await User.create({
                name: "Amit Sharma",
                email: "student@example.com",
                password: studentPassword,
                role: "student",
                branch: "CSE",
                cgpa: 8.5,
                graduationYear: 2025,
                education: "B.Tech Computer Science",
                phone: "+91 9876543210",
                skills: ["React", "Node.js", "Java", "SQL"],
            });
            console.log("Demo Student Created: student@example.com / password123");
        } else {
            console.log("Demo Student already exists.");
        }

        // 2. Seed Admin User
        const adminPassword = await bcrypt.hash("admin123", 10);
        let admin = await User.findOne({ email: "admin@example.com" });
        if (!admin) {
            admin = await User.create({
                name: "Placement Director",
                email: "admin@example.com",
                password: adminPassword,
                role: "admin",
                branch: "Administration",
                cgpa: 10.0,
                graduationYear: 2020,
                skills: ["Recruitment", "Management"],
            });
            console.log("Demo Admin Created: admin@example.com / admin123");
        } else {
            console.log("Demo Admin already exists.");
        }

        // 3. Seed Sample Company
        let company = await Company.findOne({ name: "TCS" });
        if (!company) {
            company = await Company.create({
                name: "TCS",
                industry: "Information Technology",
                website: "https://www.tcs.com",
                description: "Tata Consultancy Services is a global leader in IT services, consulting & business solutions."
            });
            console.log("Demo Company Created: TCS");
        }

        // 4. Seed Sample Job Drive
        let job = await Job.findOne({ title: "Software Engineer", companyId: company._id });
        if (!job) {
            await Job.create({
                companyId: company._id,
                title: "Software Engineer",
                description: "Seeking talented Software Engineers for fullstack development using modern web technologies and cloud infrastructure.",
                skills: ["Java", "React", "Node.js"],
                location: "Pune / Hyderabad",
                salary: "7.0 LPA",
                minimumCGPA: 7.0,
                eligibleBranches: ["CSE", "IT", "ENTC"],
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            });
            console.log("Demo Placement Drive Created: Software Engineer - TCS");
        }

        console.log("\nDatabase Seeding Completed Successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedDatabase();
