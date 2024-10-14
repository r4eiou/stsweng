const { CertificateModel, UserModel, LuponCaseModel, TanodCaseModel } = require('../models/database/mongoose');


const isAuth = (req, res, next) => {
    if(req.session.isAuth) {
        next();
    }
    else {
        res.redirect('/index');
    }
}

function add(app){
    const mongoose = require('mongoose');

    //Start
    //changes: meron na sa index
    // app.get('/', function(req, resp){
    //     resp.render('index', {
    //         layout: 'index-main',
    //         title: 'Welcome to Barangay Parang Website'
    //     });
    // });


    /************************************************************EMPLOYEE************************************************/
    //Employee-Login
    app.get('/employee-login', function(req, resp){
        resp.render('employee-login-page', {
            layout: 'index-login',
            title: 'Employee Login'
        });
    });

    //Check the Login
    app.post('/check-login', async function(req, resp){
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
            else if (curUser.role != "employee") {
                errorMsg = "Unathorized Access."
            }
            else {
                console.log("here no error")
                req.session.userRole = "Employee";
                req.session.isAuth = true;
                return resp.redirect("/employee-home");
        
            }
            console.log("here")
            resp.render('employee-login-page', {
                layout: 'index-login',
                title: 'Employee Login Retry',
                error: errorMsg
            });
            
        } catch(error){
            console.error('Error during login:', error);
            resp.render('employee-login-page', {
                layout: 'index-login',
                title: 'Employee Login Retry',
                error: 'Error Try Again'
            });
        }
    });

    //Employee-Homepage
    app.get('/employee-home', isAuth, function(req, resp){
        req.session.lastpage = '/employee-home';
        resp.render('employee-home', {
            layout: 'index-employee',
            title: 'Employee Homepage'
        });
    });

    //changes: moved to index
    // app.get('/logout', (req, res) => {
    //     req.session.destroy(err => {
    //         if (err) {
    //             return res.redirect('/index'); // Redirect to a protected route if there's an error
    //         }
    //         res.clearCookie('connect.sid'); // Clear the session cookie
    //         res.redirect('/index'); // Redirect to the login page or home page
    //     });
    // });

    /************************************************************TANOD************************************************/


    //Tanod-Login
    app.get('/tanod-login', function(req, resp){
        resp.render('tanod-login-page', {
            layout: 'index-login',
            title: 'Tanod Login'
        });
    });

    //Check Login for tanod
    app.post('/check-login-tanod', async function(req, resp){
        const { email, password } = req.body; // Retrieve email and password from request body

        //try to find user
        try{
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
            else if (curUser.role != "tanod") {
                errorMsg = "Unathorized Access."
            }
            else {
                console.log("here no error")
                req.session.isAuth = true;
                req.session.userRole = "Tanod";
                return resp.redirect('/tanod-home');
        
            }
            console.log("here")
            resp.render('tanod-login-page', {
                layout: 'index-login',
                title: 'Tanod Login Retry',
                error: errorMsg
            });
            
        } catch(error){
            console.error('Error during login:', error);
            resp.render('tanod-login-page', {
                layout: 'index-login',
                title: 'Tanod Login Retry',
                error: 'Error Try Again'
            });
        }
    });

    //Tanod Homepage
    app.get('/tanod-home', isAuth, async function(req, resp){
        try{
            const searchName = req.query.search_name || '';
            const searchRegex = new RegExp(searchName, 'i');

            //pages
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            //new code
            //for sorting
            const sortField = req.query.sort_field || 'EntryNo';
            const sortOrder = req.query.sort_order === 'asc' ? 1 : -1;
            const sortOptions = {};
            sortOptions[sortField] = sortOrder;

            //get all cases with pagination
            const cases = await TanodCaseModel.find({
                $or:[
                    {'ReporteeInfo.FirstName': searchRegex},
                    {'ReporteeInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            })
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .exec();

            const totalCases = await TanodCaseModel.countDocuments({
                $or:[
                    {'ReporteeInfo.FirstName': searchRegex},
                    {'ReporteeInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            });

            let allCases = [];
            for(const item of cases){
                let stat_lc = 'resolved';
                let isEditable = 'hidden';
                if(item.Status == 'Ongoing'){
                    stat_lc = 'ongoing';
                    isEditable = '';
                }

                allCases.push({
                    caseID : item._id,
                    entryNo: item.EntryNo,
                    date: item.Date,
                    reporteeFirstName: item.ReporteeInfo.FirstName,
                    reporteeLastName: item.ReporteeInfo.LastName,
                    respondentFirstName: item.RespondentInfo.FirstName,
                    respondentLastName: item.RespondentInfo.LastName,
                    status: item.Status,
                    stat_lc: stat_lc,
                    isEditable: isEditable
                });
            }

            let totalPages = 0;

            if(totalCases == 0){
                totalPages = 1;
            }else{
                totalPages = Math.ceil(totalCases/limit);
            }
           // const totalPages = Math.ceil(totalCases/limit);
            
            req.session.lastpage = '/tanod-home';
            resp.render('tanod-home', {
                layout: 'index-tanod',
                title: 'Tanod Homepage',
                cases: allCases,
                currentPage: page,
                totalPages: totalPages,
                sortField: sortField,
                sortOrder: req.query.sort_order || 'desc' //make it default descending
            });

        } catch(error){
            console.error('Error fetching all cases:', error);
            resp.status(500).send('Internal Server Error');
        }   
    });

    //Tanod-Create-Case
    app.get('/tanod-create', function(req, resp){
        req.session.lastpage = '/tanod-create';
        resp.render('tanod-create-case', {
            layout: 'index-create',
            title: 'Tanod Create Case',
            message: ''
        });
    });

    //Save case tp DB
    app.post('/tanod-submit-case', async function(req, resp){

        const {
            entryNumber,
            date,
            status,
            reporteeFirstName,
            reporteeMiddleInitial,
            reporteeLastName,
            reporteeAddress,
            natureOfBlotter,
            respondentFirstName,
            respondentMiddleInitial,
            respondentLastName,
            deskOfficerFirstName,
            deskOfficerMiddleInitial,
            deskOfficerLastName,
            witnessFirstName,
            witnessMiddleInitial,
            witnessLastName,
            location
        } = req.body;

        if (!entryNumber || !date || !status || !reporteeFirstName || !reporteeLastName || !natureOfBlotter || !respondentFirstName || !respondentLastName || !deskOfficerFirstName || !witnessFirstName || !location 
            || !reporteeMiddleInitial || !reporteeAddress || ! respondentMiddleInitial || !deskOfficerMiddleInitial || !deskOfficerLastName || !witnessMiddleInitial || !witnessLastName)
             {
            return resp.status(400).json({ message: 'All fields are required.' });
        }

        const entryNumberint = Number(req.body.entryNumber);

        // _id
        // Find all cases and convert _id to integers for sorting
        const allCases = await TanodCaseModel.find().exec();
        const caseIds = allCases.map(caseDoc => parseInt(caseDoc._id, 10)).filter(id => !isNaN(id));

        // Get the highest _id
        const latestIdNum = caseIds.length > 0 ? Math.max(...caseIds) : 0;
        const newReviewId = (latestIdNum + 1).toString();

        const caseData = {
            _id: newReviewId,
            EntryNo: entryNumberint,
            Date: req.body.date,
            Status: req.body.status,
            ReporteeInfo:{
                FirstName: req.body.reporteeFirstName,
                MiddleInitial: req.body.reporteeMiddleInitial,
                LastName: req.body.reporteeLastName,
                Address: req.body.reporteeAddress
            },
            natureOfBlotter: req.body.natureOfBlotter,
            RespondentInfo: {
                FirstName: req.body.respondentFirstName,
                MiddleInitial: req.body.respondentMiddleInitial,
                LastName: req.body.respondentLastName,
            },
            DeskOfficerInfo: {
                FirstName: req.body.deskOfficerFirstName,
                MiddleInitial: req.body.deskOfficerMiddleInitial,
                LastName: req.body.deskOfficerLastName,
            },
            WitnessInfo: {
                FirstName: req.body.witnessFirstName,
                MiddleInitial: req.body.witnessMiddleInitial,
                LastName: req.body.witnessLastName,
            },
            Location: req.body.location
        }

        //put all details in the db
        try{

            const existingCase = await TanodCaseModel.findOne({ EntryNo: entryNumber}).lean();

            if(existingCase){
                console.log("Entry Number already exists");
                return resp.status(400).json({message: 'Entry Number is Already Taken'});
            }
            const newCase = new TanodCaseModel(caseData);
            await newCase.save();
            console.log('Case Succesfully saved');
            console.log(entryNumber);
            resp.status(200).json({ message: 'Case successfully saved', redirectUrl: `/page-view-case/${entryNumber}` });
            //resp.redirect(`/page-view-case/${entryNumber}`);

        } catch (error){
            console.error('Error saving the case:', error);
            resp.redirect('/tanod-create');
        }
    });

    //View tanod case
    app.get('/page-view-case/:entryNumber', async function(req, resp){
        const entryNumber = Number(req.params.entryNumber);
        console.log(entryNumber);
        let resolveStat = 'selected';
        let ongoingStat = 'disabled';
        let isEditable = "hidden";

        try {
            const caseDetails = await TanodCaseModel.findOne({ EntryNo: entryNumber }).lean();
            if (caseDetails) {
                console.log('found case');
                const reporteeInfo = caseDetails.ReporteeInfo;
                const respondentInfo = caseDetails.RespondentInfo;
                const deskInfo = caseDetails.DeskOfficerInfo;
                const witnessInfo = caseDetails.WitnessInfo;


                if(caseDetails.Status == 'Ongoing'){
                    resolveStat = 'disabled';
                    ongoingStat = 'selected';
                    isEditable = '';
                }

                req.session.lastpage = `/page-view-case/${entryNumber}`;
                resp.render('tanod-view-case', {
                    layout: 'index-view-tl', 
                    title: 'View Tanod Case',
                    case: caseDetails,
                    resolveStat: resolveStat,
                    ongoingStat: ongoingStat,
                    reporteeInfo: reporteeInfo,
                    respondentInfo: respondentInfo,
                    deskInfo: deskInfo,
                    witnessInfo: witnessInfo,
                    isEditable : isEditable
                });
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    //Tanod Edit Case
    app.get('/tanod-edit-case/:entryNumber', async function(req, resp){
        const entryNumber = Number(req.params.entryNumber);
        console.log(entryNumber);
        let resolveStat = 'selected';
        let ongoingStat = '';
        try {
            const caseDetails = await TanodCaseModel.findOne({ EntryNo: entryNumber }).lean();
            if (caseDetails) {
                console.log('found case');
                const reporteeInfo = caseDetails.ReporteeInfo;
                const respondentInfo = caseDetails.RespondentInfo;
                const deskInfo = caseDetails.DeskOfficerInfo;
                const witnessInfo = caseDetails.WitnessInfo;

                if(caseDetails.Status == 'Ongoing'){
                    resolveStat = '';
                    ongoingStat = 'selected';
                }
            
                // console.log(href)
                req.session.lastpage = `/tanod-edit-case/${entryNumber}`;
                resp.render('tanod-edit-case', {
                    layout: 'index-edit', 
                    title: 'View Tanod Case',
                    case: caseDetails,
                    reporteeInfo: reporteeInfo,
                    respondentInfo: respondentInfo,
                    deskInfo: deskInfo,
                    witnessInfo: witnessInfo,
                    resolveStat: resolveStat,
                    ongoingStat: ongoingStat
                });
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    //Save Edit details
    app.post('/update-tanod-case', async function(req, resp){
        const {
            date,
            status,
            reporteeFirstName,
            reporteeMiddleInitial,
            reporteeLastName,
            reporteeAddress,
            natureOfBlotter,
            respondentFirstName,
            respondentMiddleInitial,
            respondentLastName,
            deskOfficerFirstName,
            deskOfficerMiddleInitial,
            deskOfficerLastName,
            witnessFirstName,
            witnessMiddleInitial,
            witnessLastName,
            location
        } = req.body;

        if (!date || !status || !reporteeFirstName || !reporteeLastName || !natureOfBlotter || !respondentFirstName || !respondentLastName || !deskOfficerFirstName || !witnessFirstName || !location 
            || !reporteeMiddleInitial || !reporteeAddress || ! respondentMiddleInitial || !deskOfficerMiddleInitial || !deskOfficerLastName || !witnessMiddleInitial || !witnessLastName)
             {
            return resp.status(400).json({ message: 'All fields are required.' });
        }

        const entryNumberint = Number(req.body.entryNumber);
        //code to edit the case here
        try {
            // Find the case by EntryNo and update it with new values
            const updatedCase = await TanodCaseModel.findOneAndUpdate(
                { EntryNo: entryNumberint },
                {
                    Date: req.body.date,
                    Status: req.body.status,
                    ReporteeInfo: {
                        LastName: req.body.reporteeLastName,
                        MiddleInitial: req.body.reporteeMiddleInitial,
                        FirstName: req.body.reporteeFirstName,
                        Address: req.body.reporteeAddress
                    },
                    natureOfBlotter: req.body.natureOfBlotter,
                    RespondentInfo: {
                        LastName: req.body.respondentLastName,
                        MiddleInitial: req.body.respondentMiddleInitial,
                        FirstName: req.body.respondentFirstName
                    },
                    DeskOfficerInfo: {
                        LastName: req.body.deskOfficerLastName,
                        MiddleInitial: req.body.deskOfficerMiddleInitial,
                        FirstName: req.body.deskOfficerFirstName
                    },
                    WitnessInfo: {
                        LastName: req.body.witnessLastName,
                        MiddleInitial: req.body.witnessMiddleInitial,
                        FirstName: req.body.witnessFirstName
                    },
                    Location: req.body.location
                },
                { new: true } // Return the updated document
            );

            if (updatedCase) {
                resp.status(200).json({ message: 'Case successfully updated', redirectUrl: `/page-view-case/${entryNumberint}` });
                //resp.redirect(`/page-view-case/${entryNumberint}`); // Redirect to the homepage after successful update
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error updating case details:', error);
            resp.status(500).send('Internal Server Error');
        }
    });


    //Tanod delete
    app.get('/tanod-delete-case/:entryNumber', async function(req, resp){
        const entryNumber = Number(req.params.entryNumber);
        try{
            //delete code
            const deletedCase = await TanodCaseModel.findOneAndDelete({EntryNo: entryNumber});

            if(deletedCase){
                resp.redirect('/tanod-home');
            }else{
                resp.status(404).send('Case not found');
            }
        }catch(error){
            console.error('Error deleting the case:', error);
            // Respond with a 500 status in case of an error
            resp.status(500).send('An error occurred while deleting the case');
        }
    });

    //Tanod Mark Resolve
    app.get('/tanod-mark-resolve/:entryNumber', async function(req, resp){
        const entryNumber = Number(req.params.entryNumber);
        try{
            const markResolve = await TanodCaseModel.findOneAndUpdate({EntryNo: entryNumber}, {Status: "Resolved"}, {new: true});
            if (markResolve){
                resp.redirect('/tanod-home');
            }
            else{
                resp.status(404).send('Case not found');

            }
        } catch (error){
            console.error('Error resolving case details:', error);
            resp.redirect('/tanod-home');
        }
    });

    app.post('/tanod-delete-cases', async function(req, resp) {
        const { caseIds } = req.body;
        try {
            await TanodCaseModel.deleteMany({ _id: { $in: caseIds } });
            resp.json({ success: true });
        } catch (error) {
            console.error('Error deleting Tanod cases:', error);
            resp.json({ success: false });
        }
    });

    app.post('/tanod-resolve-cases', async function(req, resp) {
        const { caseIds } = req.body;
        try {
            await TanodCaseModel.updateMany({ _id: { $in: caseIds } }, { $set: { Status: 'Resolved' }});
            resp.json({ success: true });
        } catch (error) {
            console.error('Error resolving Tanod cases:', error);
            resp.json({ success: false });
        }
    });

    app.post('/tanod-resolve-onClick', async function(req, resp){
        try{
            const caseId = req.body.caseId;
            if(!caseId){
                return resp.status(400).json({ success: false, message: 'Case ID is required'});

            }

            await TanodCaseModel.findByIdAndUpdate(caseId, {Status: 'Resolved'});

            resp.json({ success: true});
         }catch (error){
            console.error('Error updating case status:', error);
            resp.status(500).json({ success: false, message: 'Internal Server Error' });
         }
    });

    /************************************************************LUPON************************************************/


    //Lupon-Login
    app.get('/lupon-login', function(req, resp){
        resp.render('lupon-login-page', {
            layout: 'index-login',
            title: 'Lupon Login'
        });
    });

    //Check Login for Lupon
    app.post('/check-login-lupon', async function(req, resp){
        const { email, password } = req.body; // Retrieve email and password from request body

        try{
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
            else if (curUser.role != "lupon") {
                errorMsg = "Unathorized Access."
            }
            else {
                console.log("here no error")
                req.session.userRole = "Lupon";
                req.session.isAuth = true;
                return resp.redirect('/lupon-home');
        
            }
            console.log("here")
            resp.render('lupon-login-page', {
                layout: 'index-login',
                title: 'Lupon Login Retry',
                error: errorMsg
            });
            
        } catch(error){
            console.error('Error during login:', error);
            resp.render('lupon-login-page', {
                layout: 'index-login',
                title: 'Lupon Login Retry',
                error: 'Error Try Again'
            });
        }
    });


    //Lupon Homepage
    app.get('/lupon-home', isAuth, async function(req, resp){
        try{
            const searchName = req.query.search_name || '';
            const searchRegex = new RegExp(searchName, 'i');

            //pages
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            //get all cases with pagination
            const cases = await LuponCaseModel.find({
                $or:[
                    {'ComplainerInfo.FirstName': searchRegex},
                    {'ComplainerInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            })
            .skip(skip)
            .limit(limit)
            .exec();

            const totalCases = await LuponCaseModel.countDocuments({
                $or:[
                    {'ComplainerInfo.FirstName': searchRegex},
                    {'ComplainerInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            });


            let allCases = [];
            for(const item of cases){
                let stat_lc = 'resolved';
                let isEditable = 'hidden';
                if(item.Status == 'Ongoing'){
                    stat_lc = 'ongoing';
                    isEditable ='';
                }
                

                allCases.push({
                    caseID: item._id,
                        caseTitle: item.CaseTitle,
                        caseType: item.CaseType,
                        complainerFirstName: item.ComplainerInfo.FirstName,
                        complainerLastName: item.ComplainerInfo.LastName,
                        respondentFirstName: item.RespondentInfo.FirstName,
                        respondentLastName: item.RespondentInfo.LastName,
                        status: item.Status,
                        stat_lc: stat_lc,
                        isEditable: isEditable
                });
            }

            let totalPages = 0;

            if(totalCases == 0){
                totalPages = 1;
            }else{
                totalPages = Math.ceil(totalCases/limit);
            }
            //const totalPages = Math.ceil(totalCases/limit);

            req.session.lastpage = 'lupon-home';
            resp.render('lupon-home', {
                layout: 'index-lupon',
                title: 'Lupon Homepage',
                cases: allCases,
                currentPage: page,
                totalPages: totalPages
            });

        } catch(error){
            console.error('Error fetching all cases:', error);
            resp.status(500).send('Internal Server Error');
        }   
    });

    //Lupon create case
    app.get('/lupon-create', function(req, resp){
        req.session.lastpage = '/lupon-create';
        resp.render('lupon-create-case',{
            layout: 'index-create',
            title: 'Lupon Create Case'
        });
    });

    //Lupon Submit case
    app.post('/lupon-submit-case', async function(req, resp){
        const{
            caseTitle,
            caseType,
            status,
            respondentFirstName,
            respondentMiddleInitial,
            respondentLastName,
            complainerFirstName,
            complainerMiddleInitial,
            complainerLastName,
            mediationFirstName,
            mediationMiddleInitial,
            mediationLastName,
            conciliationFirstName,
            conciliationMiddleInitial,
            conciliationLastName,
            Case,
        } = req.body;

        if (!caseTitle || !caseType || !status || !complainerFirstName || !complainerMiddleInitial || !complainerLastName || !mediationFirstName || !mediationMiddleInitial || !mediationLastName || !respondentFirstName || !respondentLastName 
            || !conciliationFirstName || !conciliationMiddleInitial || ! respondentMiddleInitial || !conciliationLastName || !Case)
             {
            return resp.status(400).json({ message: 'All fields are required.' });
        }

        // _id
        // Find all cases and convert _id to integers for sorting
        const allCases = await LuponCaseModel.find().exec();
        const caseIds = allCases.map(caseDoc => parseInt(caseDoc._id, 10)).filter(id => !isNaN(id));

        // Get the highest _id
        const latestIdNum = caseIds.length > 0 ? Math.max(...caseIds) : 0;
        const newReviewId = (latestIdNum + 1).toString();

        const caseData= {
            _id: newReviewId,
            CaseTitle: req.body.caseTitle,
            CaseType: req.body.caseType,
            Status: req.body.status,
            RespondentInfo: {
                FirstName: req.body.respondentFirstName,
                MiddleInitial: req.body.respondentMiddleInitial,
                LastName: req.body.respondentLastName 
            },
            ComplainerInfo: {
                FirstName: req.body.complainerFirstName,
                MiddleInitial: req.body.complainerMiddleInitial,
                LastName: req.body.complainerLastName
            },
            MediationInfo: {
                FirstName: req.body.mediationFirstName,
                MiddleInitial: req.body.mediationMiddleInitial,
                LastName: req.body.mediationLastName
            },
            ConciliationInfo: {
                FirstName: req.body.conciliationFirstName,
                MiddleInitial: req.body.conciliationMiddleInitial,
                LastName: req.body.conciliationLastName
            },
            Case: req.body.Case
        };

        try{
            const newCase = new LuponCaseModel(caseData);
            await newCase.save();
            console.log('successfully saved');
            console.log(newCase._id)
            resp.status(200).json({ message: 'Case successfully saved', redirectUrl: `/lupon-view-case/${newCase._id}` });
            //resp.redirect(`/lupon-view-case/${newCase._id}`);
        } catch(error){
            console.error('Error saving the case:', error);
            resp.redirect('/lupon-create');
        }
    });

    //Lupon Case View
    app.get('/lupon-view-case/:_id', async function(req, resp){
        const caseID = req.params._id;
        console.log(caseID);

        let resolveStat = 'selected';
        let ongoingStat = 'disabled';
        let isEditable = "hidden";


        try {
            const caseDetails = await LuponCaseModel.findOne({ _id: caseID }).lean();
            if (caseDetails) {
                console.log('found case');
                const respondentInfo = caseDetails.RespondentInfo;
                const complainerInfo = caseDetails.ComplainerInfo;
                const mediationInfo = caseDetails.MediationInfo;
                const conciliationInfo = caseDetails.ConciliationInfo;



                if(caseDetails.Status == 'Ongoing'){
                    resolveStat = 'disabled';
                    ongoingStat = 'selected';
                    isEditable = '';
                }
                req.session.lastpage = `/lupon-view-case/${caseID}`;
                resp.render('lupon-view-case', {
                    layout: 'index-view-tl', 
                    title: 'View Lupon Case',
                    case: caseDetails,
                    resolveStat: resolveStat,
                    ongoingStat: ongoingStat,
                    respondentInfo: respondentInfo,
                    complainerInfo: complainerInfo,
                    mediationInfo:  mediationInfo,
                    conciliationInfo: conciliationInfo,
                    isEditable : isEditable
                });
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
            resp.status(500).send('Internal Server Error');
        }

    });

    //Lupon Edit case
    app.get('/lupon-edit-case/:_id', async function(req, resp){
        const caseID = req.params._id;
        console.log(caseID);
        let resolveStat = 'selected';
        let ongoingStat = '';

        try {
            const caseDetails = await LuponCaseModel.findOne({ _id: caseID }).lean();
            if (caseDetails) {
                console.log('found case');
                const respondentInfo = caseDetails.RespondentInfo;
                const complainerInfo = caseDetails.ComplainerInfo;
                const mediationInfo = caseDetails.MediationInfo;
                const conciliationInfo = caseDetails.ConciliationInfo;

                if(caseDetails.Status == 'Ongoing'){
                    resolveStat = '';
                    ongoingStat = 'selected';
                }

                req.session.lastpage = `/lupon-edit-case/${caseID}`;
                resp.render('lupon-edit-case', {
                    layout: 'index-edit', 
                    title: 'Edit Lupon Case',
                    case: caseDetails,
                    respondentInfo: respondentInfo,
                    complainerInfo: complainerInfo,
                    mediationInfo:  mediationInfo,
                    conciliationInfo: conciliationInfo,
                    resolveStat: resolveStat,
                    ongoingStat: ongoingStat
                });
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    //Lupon update
    app.post('/update-lupon-case/:_id', async function(req, resp){
        const{
            caseTitle,
            caseType,
            status,
            respondentFirstName,
            respondentMiddleInitial,
            respondentLastName,
            complainerFirstName,
            complainerMiddleInitial,
            complainerLastName,
            mediationFirstName,
            mediationMiddleInitial,
            mediationLastName,
            conciliationFirstName,
            conciliationMiddleInitial,
            conciliationLastName,
            Case
        } = req.body;

        if (!caseTitle || !caseType || !status || !complainerFirstName || !complainerMiddleInitial || !complainerLastName || !mediationFirstName || !mediationMiddleInitial || !mediationLastName || !respondentFirstName || !respondentLastName 
            || !conciliationFirstName || !conciliationMiddleInitial || ! respondentMiddleInitial || !conciliationLastName || !Case)
             {
            return resp.status(400).json({ message: 'All fields are required.' });
        }


        const caseID = req.params._id;

        //code to edit the case here
        try {
            // Find the case by EntryNo and update it with new values
            const updatedCase = await LuponCaseModel.findOneAndUpdate(
                { _id: caseID },
                {
                    CaseTitle: req.body.caseTitle,
                    CaseType: req.body.caseType,
                    Status: req.body.status,
                    RespondentInfo: {
                        FirstName: req.body.respondentFirstName,
                        MiddleInitial: req.body.respondentMiddleInitial,
                        LastName: req.body.respondentLastName 
                    },
                    ComplainerInfo: {
                        FirstName: req.body.complainerFirstName,
                        MiddleInitial: req.body.complainerMiddleInitial,
                        LastName: req.body.complainerLastName
                    },
                    MediationInfo: {
                        FirstName: req.body.mediationFirstName,
                        MiddleInitial: req.body.mediationMiddleInitial,
                        LastName: req.body.mediationLastName
                    },
                    ConciliationInfo: {
                        FirstName: req.body.conciliationFirstName,
                        MiddleInitial: req.body.conciliationMiddleInitial,
                        LastName: req.body.conciliationLastName
                    },
                    Case: req.body.Case
                },
                { new: true } // Return the updated document
            );

            if (updatedCase) {
                resp.status(200).json({ message: 'Case successfully updated', redirectUrl: `/lupon-view-case/${updatedCase._id}` });
                //resp.redirect(`/lupon-view-case/${updatedCase._id}`); // Redirect to the homepage after successful update
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error updating case details:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    //Lupon delete
    app.get('/lupon-delete-case/:_id', async function(req, resp){
        const caseID = req.params._id;
        try{
            //delete code
            const deletedCase = await LuponCaseModel.findOneAndDelete({_id: caseID});

            if(deletedCase){
                resp.redirect('/lupon-home');
            }else{
                resp.status(404).send('Case not found');
            }
        }catch(error){
            console.error('Error deleting the case:', error);
            // Respond with a 500 status in case of an error
            resp.status(500).send('An error occurred while deleting the case');
        }
    });

    //Lupon Mark Resolved
    app.get('/lupon-mark-resolve/:_id', async function(req, resp){
        const caseID = req.params._id;
        try{
            const markResolve = await LuponCaseModel.findOneAndUpdate({_id: caseID}, {Status: "Resolved"}, {new: true});
            if (markResolve){
                resp.redirect('/lupon-home');
            }
            else{
                resp.status(404).send('Case not found');

            }
        } catch (error){
            console.error('Error resolving case details:', error);
            resp.redirect('/lupon-home');
        }
    });

    app.post('/lupon-delete-cases', async function(req, resp) {
        const { caseIds } = req.body;
        try {
            await LuponCaseModel.deleteMany({ _id: { $in: caseIds } });
            resp.json({ success: true });
        } catch (error) {
            console.error('Error deleting cases:', error);
            resp.json({ success: false });
        }
    });

    app.post('/lupon-resolve-cases', async function(req, resp) {
        const { caseIds } = req.body;
        try {
            await LuponCaseModel.updateMany({ _id: { $in: caseIds } }, { $set: { Status: 'Resolved' } });
            resp.json({ success: true });
        } catch (error) {
            console.error('Error marking cases as resolved:', error);
            resp.json({ success: false });
        }
    });

    app.post('/lupon-resolve-onClick', async function(req, resp){
        try{
            const caseId = req.body.caseId;
            if(!caseId){
                return resp.status(400).json({ success: false, message: 'Case ID is required'});

            }

            await LuponCaseModel.findByIdAndUpdate(caseId, {Status: 'Resolved'});

            resp.json({ success: true});
         }catch (error){
            console.error('Error updating case status:', error);
            resp.status(500).json({ success: false, message: 'Internal Server Error' });
         }
    });

    function finalClose(){
    
        console.log('Close connection at the end!');
        mongoose.connection.close();
        process.exit();
    }
    
    process.on('SIGTERM',finalClose);  //general termination signal
    process.on('SIGINT',finalClose);   //catches when ctrl + c is used
    process.on('SIGQUIT', finalClose); //catches other termination commands
}

module.exports.add = add;