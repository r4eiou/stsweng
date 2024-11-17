const UserModel = require("../models/database/mongoose").UserModel;
const SecurityModel = require("../models/database/mongoose").SecurityQuestionModel;

const ResidentModel = require("../models/database/mongoose").ResidentModel;

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

/*
const checkLogin = async (req, res) => {
    const { email, password } = req.body; // Retrieve email and password from request body

    //try to find user
    try{
        const curUser = await UserModel.findOne({email: email}); //finds if there is a match in users
        var errorMsg = "";
        var errorflag = 0;
        // console.log(curUser.role);
        // console.log(curUser.password);
        // console.log(curUser.email);

        if (!email || !password) {
            errorMsg = "Email and Password fields cannot be empty."
            errorflag = 1;
        }
        else if (!email.includes("@")) {
            errorMsg = "Invalid email.";
            errorflag = 1;
        }
        else if (!curUser) {
            errorMsg = "User Not Found."
            errorflag = 1;
        }
        else if (curUser.password != password) {
            errorMsg = "Incorrect password."
            errorflag = 1;
        }
        //TO EMPLOYEE PAGE
        else if (curUser.role == "employee") {
            console.log("ENTER EMPLOYEE PAGE")
            req.session.userRole = "Employee";
            req.session.isAuth = true;
            return res.redirect("/employee-index");
    
        }
        //TO ADMIN PAGE
        else if (curUser.role == "admin") {
            console.log("ENTER ADMIN PAGE")
            req.session.userRole = "Admin";
            req.session.isAuth = true;
            return res.redirect("/admin-index");
    
        }
        //TO TANOD PAGE
        else if (curUser.role == "tanod") {
            console.log("ENTER TANOD PAGE")
            req.session.userRole = "Tanod";
            req.session.isAuth = true;
            return res.redirect("/tanod-index");
    
        }
        //TO LUPON PAGE
        else if (curUser.role == "lupon") {
            console.log("ENTER LUPON PAGE")
            req.session.userRole = "Lupon";
            req.session.isAuth = true;
            return res.redirect("/lupon-index");
    
        }
        //TO RESIDENT PAGE
        else if (curUser.role == "resident") {
            console.log("ENTER RESIDENT PAGE")
            req.session.userRole = "Resident";
            req.session.isAuth = true;
            return res.redirect(`/resident-index/${email}`);
    
        }

        if(errorflag) {
            console.log("ERROR IN LOGIN")
            res.render('login', {
                layout: 'index-login',
                title: 'Login Page',
                error: errorMsg
            });
        }
        
    } catch(error){
        console.error('Error during login:', error);
        res.render('login', {
            layout: 'index-login',
            title: 'Login Page'
        });
    }
}
*/

const checkLogin = async (req, res) => {
    const { email, password } = req.body; // Retrieve email and password from request body

    try {
        const curUser = await UserModel.findOne({ email: email }); // Finds if there is a match in users
        var errorMsg = "";
        var errorflag = 0;

        if (!email || !password) {
            errorMsg = "Email and Password fields cannot be empty.";
            errorflag = 1;
        } else if (!email.includes("@")) {
            errorMsg = "Invalid email.";
            errorflag = 1;
        } else if (!curUser) {
            errorMsg = "User Not Found.";
            errorflag = 1;
        } else if (curUser.password !== password) { 
            errorMsg = "Incorrect password.";
            errorflag = 1;
        } else {
            req.session.userRole = curUser.role.charAt(0).toUpperCase() + curUser.role.slice(1); // Capitalize the role for session
            req.session.isAuth = true;

            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.render('login', {
                        layout: 'index-login',
                        title: 'Login Page',
                        error: 'Session save error. Please try again.'
                    });
                }

                switch (curUser.role) {
                    case "employee":
                        console.log("ENTER EMPLOYEE PAGE");
                        return res.redirect("/employee-index");
                    case "admin":
                        console.log("ENTER ADMIN PAGE");
                        return res.redirect("/admin-index");
                    case "tanod":
                        console.log("ENTER TANOD PAGE");
                        return res.redirect("/tanod-index");
                    case "lupon":
                        console.log("ENTER LUPON PAGE");
                        return res.redirect("/lupon-index");
                    case "resident":
                        console.log("ENTER RESIDENT PAGE");
                        return res.redirect(`/resident-index/${email}`);
                    default:
                        console.log("GO BACK TO INDEX");
                        return res.redirect("/login"); // Add a default redirect if necessary
                }
            });
        }

        if (errorflag) {
            console.log("ERROR IN LOGIN");
            res.render('login', {
                layout: 'index-login',
                title: 'Login Page',
                error: errorMsg
            });
        }
        
    } catch (error) {
        console.error('Error during login:', error);
        res.render('login', {
            layout: 'index-login',
            title: 'Login Page',
            error: 'An unexpected error occurred. Please try again.'
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
            Email : email
        });

        const existingUser = await UserModel.findOne({
            email : email
        });

        var errorMsg = "";

        if (!email || !password ||!firstname ||!lastname) {
            errorMsg = "All fields must be complete."
        }
        else if (!email.includes("@")) {
            errorMsg = "Invalid email.";
        }
        else if (!residentUser) {
            errorMsg = "Not yet registered.";
        }
        else if (existingUser && existingUser.role === "resident") {
            res.render('signup', {
                layout: 'index-login',
                title: 'Signup Page',
                accountCreated: true,
                header: "You are not yet registered.",
                sub: "Please contact the barangay for registration inquiries."
            });
        }
        else if (residentUser) {
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
                email: email,
                password: password,
                role: "resident"
            };

            const newUser = new UserModel(userDetails);
            await newUser.save();
            console.log('User created and saved');

            res.render('signup', {
                layout: 'index-login',
                title: 'Signup Page',
                accountCreated: true,
                header: "Account Created Successfully!",
                sub: "Your account has been created. You can now log in."
            });
            
        }

        if (errorMsg) {
            console.log("ERROR IN SIGNUP");
            return res.render('signup', {
                layout: 'index-login',
                title: 'Signup Page',
                error: errorMsg
            });
        }
        
    } catch(error){
        console.error('Error during login:', error);
        res.render('signup', {
            layout: 'index-login',
            title: 'Signup Page'
        });
    }
}

//resident
const viewResidentIndex = async (req, res) => {
    const { email } = req.params;
    const curResident = await ResidentModel.findOne({Email: email}).lean(); //finds if there is a match in users

    req.session.lastpage = `/resident-index/${email}`;
    res.render('resident-index', {
        layout: 'index-employee',
        title: 'Resident Homepage',
        resident: curResident
    });
}

module.exports = {
    checkLogin,
    checkUserRole,
    login,
    signup,
    checkSignup,

    viewResidentIndex
}

