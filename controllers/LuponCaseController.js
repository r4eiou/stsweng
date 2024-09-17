const LuponCaseModel = require("../models/database/mongoose").LuponCaseModel;

const viewLuponDB = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
        req.session.lastpage = '/admin-lupon-db-view';
        const casesPerPage = 10; // Number of cases to show per page

        const totalCases = await LuponCaseModel.countDocuments(); // Get total number of cases
        const totalPages = Math.ceil(totalCases / casesPerPage); // Calculate total pages

        // Fetch the cases for the current page
        const cases = await LuponCaseModel.find({})
            .skip((page - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();

        res.render('admin-lupon-db-view',{
            layout: 'layout',
            title: 'Admin: Lupon DB viewing',
            cssFile1: 'homepage',
            cssFile2: 'db-view',
            javascriptFile1: 'components',
            javascriptFile2: 'header',
            cases: cases,
            currentPage: page, // Pass current page to the template
            totalPages: totalPages // Pass total pages to the template
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const viewPageLuponDB = async (req, res) => {
    try {
        const currentPage = req.params.currentPage || 1;
        
        const casesPerPage = 10; // Number of cases to show per page

        const totalCases = await LuponCaseModel.countDocuments(); // Get total number of cases
        const totalPages = Math.ceil(totalCases / casesPerPage); // Calculate total pages

        // Fetch the cases for the current page
        const cases = await TanodCaseModel.find({})
            .skip((currentPage - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();

        res.render('admin-lupon-db-view',{
            layout: 'layout',
            title: 'Admin: Lupon DB viewing',
            cssFile1: 'homepage',
            cssFile2: 'db-view',
            javascriptFile1: 'components',
            javascriptFile2: 'header',
            cases: cases,
            currentPage: currentPage, // Pass current page to the template
            totalPages: totalPages // Pass total pages to the template
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const viewSearchLuponDB = async (req, res) => {
    try {
        console.log("checking if im here");
        
        const name = req.params.search_name;
        const searchWords = name.split(' ').filter(word => word.trim() !== '');

        const orConditions = searchWords.map(word => ({
            $or: [
                { 'RespondentInfo.FirstName': { $regex: new RegExp(word, 'i') } },
                { 'RespondentInfo.LastName': { $regex: new RegExp(word, 'i') } }
            ]
        }));
        
        const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
        const casesPerPage = 10; // Number of cases to show per page

        // Fetch the cases for the current page
        const cases = await LuponCaseModel.find({ $or: orConditions })
            .skip((page - 1) * LuponCaseModel)
            .limit(casesPerPage)
            .lean();

        const totalCount = await LuponCaseModel.countDocuments({ $or: orConditions });
        const totalPages = Math.ceil(totalCount / casesPerPage); // Calculate total pages

        res.render('admin-lupon-db-view',{
            layout: 'layout',
            title: 'Admin: Lupon DB viewing',
            cssFile1: 'homepage',
            cssFile2: 'db-view',
            javascriptFile1: 'components',
            javascriptFile2: 'header',
            cases: cases,
            currentPage: page, // Pass current page to the template
            totalPages: totalPages // Pass total pages to the template
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const updateStatus = async (req, res) => {
    try {
        const caseId = req.params.id;
        const currentPage = Number(req.params.currentPage) || 1;
        const currentStatus = req.params.status; 

        const newStatus = currentStatus === 'Resolved' ? 'Ongoing' : 'Resolved';

        await LuponCaseModel.findOneAndUpdate(
            { _id : caseId},
            { Status : newStatus},
            { new: true }
        );

        res.redirect(`/admin-lupon-db-view?page=${currentPage}`);

    } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ error: 'Failed to update status' });
    }
}

const viewCreateLuponCase = async (req, res) => {
    try {
        const caseId = req.params.id;
        req.session.lastpage = '/A-lupon-create-case';
        const specificCase = await LuponCaseModel.findOne({ _id : caseId }).lean();

        res.render('A-lupon-create-case',{
            layout: 'layout',
            title: 'Barangay Parang - Admin - Lupon Create Case Page',
            cssFile1: 'index',
            cssFile2: 'form',
            javascriptFile1: 'header-hbs',
            javascriptFile2: 'case-form',
            cases: specificCase
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const createLuponCase = async (req, res) => {
    try {
        const {
            CaseTitle, 
            CaseType, 
            Status, 
            respondentLastName, 
            respondentMiddleInitial, 
            respondentFirstName, 
            complainerLastName, 
            complainerMiddleInitial, 
            complainerFirstName, 
            MediationLastName, 
            MediationMiddleInitial, 
            MediationFirstName, 
            ConciliationLastName, 
            ConciliationMiddleInitial, 
            ConciliationFirstName, 
            Case
        } = req.body;

        // _id
        // Find all cases and convert _id to integers for sorting
        const allCases = await LuponCaseModel.find().exec();
        const caseIds = allCases.map(caseDoc => parseInt(caseDoc._id, 10)).filter(id => !isNaN(id));

        // Get the highest _id
        const latestIdNum = caseIds.length > 0 ? Math.max(...caseIds) : 0;
        const newReviewId = (latestIdNum + 1).toString();

        await LuponCaseModel.create({
            _id: newReviewId,
            CaseTitle: CaseTitle,
            CaseType: CaseType,
            Status: Status,
            RespondentInfo: {
                FirstName: respondentFirstName,
                MiddleInitial: respondentMiddleInitial,
                LastName: respondentLastName
            },
            ComplainerInfo: {
                FirstName: complainerFirstName,
                MiddleInitial: complainerMiddleInitial,
                LastName: complainerLastName
            },
            MediationInfo: {
                FirstName: MediationFirstName,
                MiddleInitial: MediationMiddleInitial,
                LastName: MediationLastName
            },
            ConciliationInfo: {
                FirstName: ConciliationFirstName,
                MiddleInitial: ConciliationMiddleInitial,
                LastName: ConciliationLastName
            },
            Case: Case
        });

        res.redirect("/admin-lupon-db-view");
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const markMultipleTCaseResolved = async (req, res) => {
    const selectedCaseIds = req.body.caseIds;
    
    try {
        const updateResult = await LuponCaseModel.updateMany(
            { _id: { $in: selectedCaseIds } },
            { $set: { Status: "Resolved" } }
        );
        
        res.json({ success: true, message: 'Cases resolved successfully' });
        
    } catch (error) {
        console.error("Error updating cases:", error);
        res.status(500).json({ success: false, message: 'Error updating cases', error });
    }
};

const deleteMultipleTanodCase = async (req, res) => {
    const selectedCaseIds = req.body.caseIds;
    try {
        await LuponCaseModel.deleteMany({ _id : { $in: selectedCaseIds } });

        res.json({ success: true, message: 'Cases deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting cases', error });
    }
};

const searchLuponCase = async (req, res) => {
    const searchName = req.params.search_name;
    console.log(searchName); //Returns Juan Dela Cruz
    const searchWords = searchName.split(' ').filter(word => word.trim() !== '');

    try {
        
        const orConditions = searchWords.map(word => ({
            $or: [
                { 'RespondentInfo.FirstName': { $regex: new RegExp(word, 'i') } },
                { 'RespondentInfo.LastName': { $regex: new RegExp(word, 'i') } }
            ]
        }));

        // Find documents matching any of the $or conditions
        const searchResults = await LuponCaseModel.find({ $or: orConditions }).lean().exec();

        res.json({ success: true, results: searchResults });

    } catch (error) {
        console.error('Error searching cases:', error);
        res.status(500).json({ success: false, message: 'Error searching cases', error });
    }
};

const viewLuponCase = async (req, res) => {
    try {
        const caseId = req.params.id;
        req.session.lastpage = `/A-lupon-view-case/${caseId}`;
        const specificCase = await LuponCaseModel.findOne({ _id : caseId }).lean();
        // console.log(cases);
        res.render('A-lupon-view-case',{
            layout: 'layout',
            title: 'Barangay Parang - Admin - Lupon View Case Page',
            cssFile1: 'index',
            cssFile2: 'form',
            javascriptFile1: 'header-hbs',
            javascriptFile2: null,
            cases: specificCase
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const markResolved = async (req, res) => {
    try {
        const caseId = req.params.id;
        const specificCase = await LuponCaseModel.findOne({ _id : caseId }).lean();
        // console.log(cases);
        
        //update status to "Resolved"
        specificCase.Status = "Resolved";

        await LuponCaseModel.findOneAndUpdate(
            { _id : caseId },
            {
                $set: {
                    Status: "Resolved"
                }
            },
            { new: true }
        );

        // Render the updated view
        res.redirect('/admin-lupon-db-view');

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const editLuponCase = async (req, res) => {
    try {
        const caseId = req.params.id;
        req.session.lastpage = `/A-lupon-edit-case/${caseId}`;
        const specificCase = await LuponCaseModel.findOne({ _id : caseId }).lean();

        res.render('A-lupon-edit-case',{
            layout: 'layout',
            title: 'Barangay Parang - Admin - Lupon Edit Case Page',
            cssFile1: 'index',
            cssFile2: 'form',
            javascriptFile1: 'header-hbs',
            javascriptFile2: 'case-form',
            cases: specificCase
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const submitEditLuponCase = async (req, res) => {
    try {
        const {
            _id, 
            CaseTitle, 
            CaseType, 
            Status, 
            respondentLastName, 
            respondentMiddleInitial, 
            respondentFirstName, 
            complainerLastName, 
            complainerMiddleInitial, 
            complainerFirstName, 
            MediationLastName, 
            MediationMiddleInitial, 
            MediationFirstName, 
            ConciliationLastName, 
            ConciliationMiddleInitial, 
            ConciliationFirstName, 
            Case
        } = req.body;

        await LuponCaseModel.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    CaseTitle: CaseTitle,
                    CaseType: CaseType,
                    Status: Status,
                    RespondentInfo: {
                        FirstName: respondentFirstName,
                        MiddleInitial: respondentMiddleInitial,
                        LastName: respondentLastName
                    },
                    ComplainerInfo: {
                        FirstName: complainerFirstName,
                        MiddleInitial: complainerMiddleInitial,
                        LastName: complainerLastName
                    },
                    MediationInfo: {
                        FirstName: MediationFirstName,
                        MiddleInitial: MediationMiddleInitial,
                        LastName: MediationLastName
                    },
                    ConciliationInfo: {
                        FirstName: ConciliationFirstName,
                        MiddleInitial: ConciliationMiddleInitial,
                        LastName: ConciliationLastName
                    },
                    Case: Case
                }
            },
            { new: true }
        );

        res.redirect(`/A-lupon-view-case/${_id}`);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const deleteLuponCase = async (req, res) => {
    try {
        const caseId = req.params.id;

        await LuponCaseModel.findByIdAndDelete(caseId);

        res.redirect("/admin-lupon-db-view");
    } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ error: 'Failed to update status' });
    }
}

module.exports = {
    viewLuponDB,
    updateStatus,
    viewLuponCase,
    markResolved,
    deleteLuponCase,
    deleteMultipleTanodCase,
    markMultipleTCaseResolved,
    editLuponCase,
    submitEditLuponCase,
    viewCreateLuponCase,
    createLuponCase,
    searchLuponCase,

    viewSearchLuponDB,
    viewPageLuponDB
}