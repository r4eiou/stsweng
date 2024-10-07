const { ResidentModel } = require("../models/database/mongoose");

const UserModel = require("../models/database/mongoose").UserModel;
const SecurityModel = require("../models/database/mongoose").SecurityQuestionModel;

const login = async (req, res) => {
    const question = await SecurityModel.findOne({ _id : 1 }).lean();
    res.render('login', {
        layout: 'index-login',
        title: 'Login Page',
        securityQues : question.Question
    });
}

const checkUserRole = async (req, res) => {
    const { email } = req.body;

    try {
        // Find user by email
        const user = await UserModel.findOne({ email: email });

        if (user) {
            // Return user role as JSON response
            res.json({ role: user.role });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error checking user role:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

const checkLogin = async (req, res) => {
    const { email, password } = req.body; // Retrieve email and password from request body

    //try to find user
    try{
        const curUser = await UserModel.findOne({email: email}); //finds if there is a match in users
        var errorMsg = "";
        // console.log(curUser.role);
        // console.log(curUser.password);
        // console.log(curUser.email);

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
        //TO EMPLOYEE PAGE
        else if (curUser.role == "employee") {
            console.log("ENTER EMPLOYEE PAGE")
            req.session.userRole = "Employee";
            req.session.isAuth = true;
            return res.redirect("/employee-home");
    
        }
        //TO ADMIN PAGE
        else if (curUser.role == "admin") {
            console.log("ENTER ADMIN PAGE")
            req.session.userRole = "Admin";
            req.session.isAuth = true;
            return res.redirect("/admin-homepage");
    
        }
        //TO TANOD PAGE
        else if (curUser.role == "tanod") {
            console.log("ENTER TANOD PAGE")
            req.session.userRole = "Tanod";
            req.session.isAuth = true;
            return res.redirect("/tanod-home");
    
        }
        //TO LUPON PAGE
        else if (curUser.role == "lupon") {
            console.log("ENTER LUPON PAGE")
            req.session.userRole = "Lupon";
            req.session.isAuth = true;
            return res.redirect("/lupon-home");
    
        }
        //TO RESIDENT PAGE


        console.log("ERROR IN LOGIN")
        res.render('login', {
            layout: 'index-login',
            title: 'Login Page',
            error: errorMsg
        });
        
    } catch(error){
        console.error('Error during login:', error);
        res.render('login', {
            layout: 'index-login',
            title: 'Login Page'
        });
    }
}

const signup = async (req, res) => {
    res.render('signup', {
        layout: 'index-login',
        title: 'Signup Page'
    });
}

const checkSignup = async (req, res) => {
    const { lastname, firstname, email, password } = req.body; // Retrieve email and password from request body

    //try to find user
    try{
        const residentUser = await ResidentModel.findOne({
            firstname: firstname, 
            lastname: lastname 
        });
        var errorMsg = "";

        if (!email || !password ||!firstname ||!lastname) {
            errorMsg = "All fields must be complete."
        }
        else if (!email.includes("@")) {
            errorMsg = "Invalid email.";
        }

        //di pa complete

        console.log("ERROR IN SIGNUP")
        res.render('login', {
            layout: 'index-login',
            title: 'Login Page',
            error: errorMsg
        });
        
    } catch(error){
        console.error('Error during login:', error);
        res.render('signup', {
            layout: 'index-login',
            title: 'Signup Page'
        });
    }
}


module.exports = {
    checkLogin,
    checkUserRole,
    login,
    signup
}

