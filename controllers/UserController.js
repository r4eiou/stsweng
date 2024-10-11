const UserModel     = require("../models/database/mongoose").UserModel;
const SecurityModel = require("../models/database/mongoose").SecurityQuestionModel;

//SECURITY ---------------------------------------------
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

const checkAnswer = async (req, res) => {
    try {
        const { answer } = req.body;
        const question = await SecurityModel.findOne({ _id : 1 }).lean();
    
        const correctAnswer = question.Answer; // Fetch this from your database
        if (answer === correctAnswer) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const changeSecurityQuestion = async (req, res) => {
    try {
        const { Question, Answer } = req.body;
        console.log(Question)
        console.log(Answer)
        
        await SecurityModel.findOneAndUpdate(
            { _id: 1 },
            {
                $set: {
                    Question: Question,
                    Answer: Answer
                }
            },
            { new: true }
        );
        
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

//

const isUser = async (req, res) => {
    const { email, password } = req.body;
    const question = await SecurityModel.findOne({ _id : 1 }).lean();

    // DEBUGGING //
    /*  
        console.log(email);
        console.log(password);
    */
    try {
        // Find the user by email
        const curUser = await UserModel.findOne({email: email}); //finds if there is a match in users
        var errorMsg = "";

        if (!email || !password) {
            errorMsg = "Email and Password fields cannot be empty."
        }
        else if (!email.includes("@")) {
            errorMsg = "Invalid email.";
        }
        else if (!curUser) {
            errorMsg = "User Not Found."
        }
        else if (curUser.password != password) {
            errorMsg = "Incorrect password."
        }
        else if (curUser.role != "admin") {
            errorMsg = "Unathorized Access."
        }
        else {
            console.log("here no error")
            // Respond with success
            req.session.isAuth = true;
            req.session.userRole = "Admin";
            return res.redirect('/admin-homepage');
    
        }
        console.log("here")
        res.render('admin-login-page',{
            layout: 'layout',
            title: 'Barangay Parang - Admin Login Page',
            cssFile1: 'index',
            cssFile2: 'login-page',
            javascriptFile1: 'login',
            javascriptFile2: 'security',
            error: errorMsg,
            securityQues : question.Question
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const viewAllAccounts = async (req, res) => {
    try {
        //pages
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;


        const accounts = await UserModel.find().skip(skip).limit(limit).lean();
        const totalAccounts = await UserModel.countDocuments();
        const totalPages = Math.ceil(totalAccounts / limit);
        const question = await SecurityModel.findOne({ _id: 1 }).lean();

        
        req.session.lastpage = '/admin-accounts-db-view';
        res.render('admin-accounts-db-view', {
            layout: 'layout',
            title: 'Admin: Accounts DB Viewing',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
            accounts: accounts,
            securityQues : question.Question, 
            currentPage: page,
            totalPages: totalPages
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const viewAllAccountsSecurity = async (req, res) => {
    try {
        //pages
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;


        const accounts = await UserModel.find().skip(skip).limit(limit).lean();
        const totalAccounts = await UserModel.countDocuments();
        const totalPages = Math.ceil(totalAccounts / limit);
        const question = await SecurityModel.findOne({ _id: 1 }).lean();

        
        req.session.lastpage = '/admin-accounts-db-view-security';
        res.render('admin-accounts-db-view-security', {
            layout: 'layout',
            title: 'Admin: Accounts DB Viewing',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
            accounts: accounts,
            securityQues : question.Question, 
            currentPage: page,
            totalPages: totalPages
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

//ADMIN ------------------------------------------------
const viewAdminAcc = async (req, res) => {
    try {
        const caseId = req.params.id;
        const specificAcc = await UserModel.findOne({ _id : caseId }).lean();

        // console.log(caseId) 

        req.session.lastpage = `/admin-view-acct-admin/${caseId}`;
        res.render('admin-view-acct-admin', {
            layout: 'layout',
            title: 'Admin: Admin Account View Page',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
            accounts: specificAcc
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const editAdminAcc = async (req, res) => {
    try {
        const caseId = req.params.id;
        const specificAcc = await UserModel.findOne({ _id : caseId }).lean();

        // console.log(caseId) 

        req.session.lastpage = `/admin-edit-acct-admin/${caseId}`;
        res.render('admin-edit-acct-admin', {
            layout: 'layout',
            title: 'Admin: Admin Account Edit Page',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
            accounts: specificAcc
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const submitEditAdminAcc = async (req, res) => {
    try {
        const {
            _id,
            email,
            password
        } = req.body;

        await UserModel.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    email: email,
                    password: password
                }
            },
            { new: true }
        );

        res.redirect(`/admin-view-acct-admin/${_id}`);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const createAccount =  async (req, res) => {
    try{
        req.session.lastpage = '/create-acc';
        res.render('admin-create-acct', {
            layout: 'layout',
            title: 'Admin: Create Account',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
        });
    }catch (err){
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
    
}

const submitCreateAcc = async (req, res) => {
    const pw = req.body.password;
    const cpw = req.body.confirmPW;
    const role = req.body.role;
    if(!role){
        return res.render('admin-create-acct', {
            layout: 'layout',
            title: 'Admin: Create Account',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
            message: "Role is required"
        });
    }

    if(pw == cpw){
        try {

            const existingUser = await UserModel.findOne({email: req.body.email});
            if(existingUser){
                return res.render('admin-create-acct', {
                    layout: 'layout',
                    title: 'Admin: Create Account',
                    cssFile1: null,
                    cssFile2: null,
                    javascriptFile1: null,
                    javascriptFile2: null,
                    message: "Email already exists. Please use a different email."
                });
            }
            let newId;
            const highestIdUser = await UserModel.findOne().sort({ _id: -1 });
            
            if (highestIdUser) {
                newId = (parseInt(highestIdUser._id) + 1).toString();
            } else {
                newId = '1';
            }

            while (await UserModel.findById(newId)) {
                newId = (parseInt(newId) + 1).toString();
            }

            const userDetails = {
                _id: newId,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            };

            const newUser = new UserModel(userDetails);
            await newUser.save();
            console.log('User created and saved');
            res.redirect('/admin-accounts-db-view');
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ message: "Server error" });
        }
    } else{
        res.render('admin-create-acct', {
            layout: 'layout',
            title: 'Admin: Create Account',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
            message: "Please Enter Password Again"
        });
    }
}

//EMPLOYEE ----------------------------------------------
const viewEmployeeAcc = async (req, res) => {
    try {
        const caseId = req.params.id;
        const specificAcc = await UserModel.findOne({ _id : caseId }).lean();

        // console.log(caseId) 

        req.session.lastpage = `/admin-view-acct-employee/${caseId}`;
        res.render('admin-view-acct-employee', {
            layout: 'layout',
            title: 'Admin: Employee Account View Page',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
            accounts: specificAcc
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const editEmployeeAcc = async (req, res) => {
    try {
        const caseId = req.params.id;
        const specificAcc = await UserModel.findOne({ _id : caseId }).lean();

        // console.log(caseId) 

        req.session.lastpage = `/admin-edit-acct-employee/${caseId}`;
        res.render('admin-edit-acct-employee', {
            layout: 'layout',
            title: 'Admin: Employee Account Edit Page',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
            accounts: specificAcc
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const submitEditEmployeeAcc = async (req, res) => {
    try {
        const {
            _id,
            email,
            password
        } = req.body;

        await UserModel.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    email: email,
                    password: password
                }
            },
            { new: true }
        );

        res.redirect(`/admin-view-acct-employee/${_id}`);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}


//LUPON -------------------------------------------------
const viewLuponAcc = async (req, res) => {
    try {
        const caseId = req.params.id;
        const specificAcc = await UserModel.findOne({ _id : caseId }).lean();

        // console.log(caseId) 

        req.session.lastpage = `/admin-view-acct-lupon/${caseId}`;
        res.render('admin-view-acct-lupon', {
            layout: 'layout',
            title: 'Admin: Lupon Account View Page',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
            accounts: specificAcc
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const editLuponAcc = async (req, res) => {
    try {
        const caseId = req.params.id;
        const specificAcc = await UserModel.findOne({ _id : caseId }).lean();

        // console.log(caseId) 

        req.session.lastpage = `/admin-edit-acct-lupon/${caseId}`;
        res.render('admin-edit-acct-lupon', {
            layout: 'layout',
            title: 'Admin: Lupon Account Edit Page',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
            accounts: specificAcc
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const submitEditLuponAcc = async (req, res) => {
    try {
        const {
            _id,
            email,
            password
        } = req.body;

        await UserModel.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    email: email,
                    password: password
                }
            },
            { new: true }
        );

        res.redirect(`/admin-view-acct-lupon/${_id}`);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

//TANOD -------------------------------------------------
const viewTanodAcc = async (req, res) => {
    try {
        const caseId = req.params.id;
        const specificAcc = await UserModel.findOne({ _id : caseId }).lean();

        // console.log(caseId) 

        req.session.lastpage = `/admin-view-acct-tanod/${caseId}`;
        res.render('admin-view-acct-tanod', {
            layout: 'layout',
            title: 'Admin: Tanod Account View Page',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
            accounts: specificAcc
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const editTanodAcc = async (req, res) => {
    try {
        const caseId = req.params.id;
        const specificAcc = await UserModel.findOne({ _id : caseId }).lean();

        // console.log(caseId) 

        req.session.lastpage = `/admin-edit-acct-tanod/${caseId}`;
        res.render('admin-edit-acct-tanod', {
            layout: 'layout',
            title: 'Admin: Tanod Account Edit Page',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
            accounts: specificAcc
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const submitEditTanodAcc = async (req, res) => {
    try {
        const {
            _id,
            email,
            password
        } = req.body;

        await UserModel.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    email: email,
                    password: password
                }
            },
            { new: true }
        );

        res.redirect(`/admin-view-acct-tanod/${_id}`);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getLogin,
    checkAnswer,
    changeSecurityQuestion,
    
    isUser,
    viewAllAccounts,

    viewAdminAcc,
    editAdminAcc,
    submitEditAdminAcc,
    createAccount,
    submitCreateAcc,

    editEmployeeAcc,
    viewEmployeeAcc,
    submitEditEmployeeAcc,

    viewLuponAcc,
    editLuponAcc,
    submitEditLuponAcc,

    viewTanodAcc,
    editTanodAcc,
    submitEditTanodAcc,

    viewAllAccountsSecurity
}