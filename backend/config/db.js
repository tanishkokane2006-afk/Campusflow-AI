const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB Atlas connection failed:", error.message);
        console.log("Attempting local MongoDB connection fallback...");
        try {
            await mongoose.connect("mongodb://127.0.0.1:27017/campusflow", {
                serverSelectionTimeoutMS: 3000,
            });
            console.log("Local MongoDB connected successfully");
        } catch (localErr) {
            console.error("Local MongoDB connection also failed:", localErr.message);
        }
    }
};

module.exports = connectDB;