const SecurityModel = require("../models/database/mongoose").SecurityQuestionModel;

const getLogin = async (req, res) => {
    try {
        const question = await SecurityModel.findOne({ _id : 1 }).lean();

        res.render('admin-login-page',{
            layout: 'layout',
            title: 'Barangay Parang - Admin Login Page',
            cssFile1: 'index',
            cssFile2: 'login-page',
            javascriptFile1: 'login',
            javascriptFile2: 'security',
            error: null,
            securityQues : question.Question
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getLogin
}