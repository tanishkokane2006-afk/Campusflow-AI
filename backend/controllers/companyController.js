const Company = require("../models/Company");

const createCompany = async (req, res) => {
    try {
        const { name, industry, website, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Company name is required"
            });
        }

        const company = await Company.create({
            name,
            industry,
            website,
            description
        });

        res.status(201).json({
            message: "Company created successfully",
            company
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find()
            .sort({ createdAt: -1 });

        res.json(companies);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createCompany,
    getCompanies
};