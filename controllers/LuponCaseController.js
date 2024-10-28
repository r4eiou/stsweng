const LuponCaseModel = require("../models/database/mongoose").LuponCaseModel;

//old ver
// const viewLuponDB = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
//         req.session.lastpage = '/admin-lupon-db-view';
//         const casesPerPage = 10; // Number of cases to show per page

//         const totalCases = await LuponCaseModel.countDocuments(); // Get total number of cases
//         const totalPages = Math.ceil(totalCases / casesPerPage); // Calculate total pages

//         // Fetch the cases for the current page
//         const cases = await LuponCaseModel.find({})
//             .skip((page - 1) * casesPerPage)
//             .limit(casesPerPage)
//             .lean();

//         res.render('admin-lupon-db-view',{
//             layout: 'layout',
//             title: 'Admin: Lupon DB viewing',
//             cssFile1: 'homepage',
//             cssFile2: 'db-view',
//             javascriptFile1: 'components',
//             javascriptFile2: 'header',
//             cases: cases,
//             currentPage: page, // Pass current page to the template
//             totalPages: totalPages // Pass total pages to the template
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Server error" });
//     }
// }

const viewLuponDB = async (req, res) => {
    const status = req.query.status || req.session.selectedLuponStatus || "0"; 
    req.session.selectedLuponStatus = status;
    req.session.lastpage = '/admin-lupon-db-view';

    var page = parseInt(req.query.page) || 1; 
    const casesPerPage = 10; // Number of cases to show per page

    let cases;
    let totalCases;

    // console.log(status); //debugging

    if (status === "0") {
        // View All Cases (archived cases not included)
        totalCases = await LuponCaseModel.countDocuments({isArchived: false}); // Get total number of all cases
        cases = await LuponCaseModel.find({isArchived: false})
            .skip((page - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();

    } else if (status === "1") {
        // View Ongoing Cases na hindi pa nadedelete
        totalCases = await LuponCaseModel.countDocuments({ Status: "Ongoing", isArchived: false }); // Count only ongoing cases
        if (totalCases <= 10) {
            page = 1
        }
        cases = await LuponCaseModel.find({ Status: "Ongoing", isArchived: false })
            .skip((page - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();
    } else if (status === "2") {
        // View Resolved Cases na hindi pa nadedelete
        if (totalCases <= 10) {
            page = 1
        }
        totalCases = await LuponCaseModel.countDocuments({ Status: "Resolved", isArchived: false }); // Count only resolved cases
        cases = await LuponCaseModel.find({ Status: "Resolved", isArchived: false })
            .skip((page - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();
    } else if (status === "3") {
        // View Archived Cases
        if (totalCases <= 10) {
            page = 1
        }
        totalCases = await LuponCaseModel.countDocuments({ isArchived: true }); // Count only archived cases
        cases = await LuponCaseModel.find({ isArchived: true })
            .skip((page - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();
    }

    const totalPages = Math.ceil(totalCases / casesPerPage); // Calculate total pages

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
}

// const viewPageLuponDB = async (req, res) => {
//     try {
//         const currentPage = req.params.currentPage || 1;
        
//         const casesPerPage = 10; // Number of cases to show per page

//         const totalCases = await LuponCaseModel.countDocuments(); // Get total number of cases
//         const totalPages = Math.ceil(totalCases / casesPerPage); // Calculate total pages

//         // Fetch the cases for the current page
//         const cases = await TanodCaseModel.find({})
//             .skip((currentPage - 1) * casesPerPage)
//             .limit(casesPerPage)
//             .lean();

//         res.render('admin-lupon-db-view',{
//             layout: 'layout',
//             title: 'Admin: Lupon DB viewing',
//             cssFile1: 'homepage',
//             cssFile2: 'db-view',
//             javascriptFile1: 'components',
//             javascriptFile2: 'header',
//             cases: cases,
//             currentPage: currentPage, // Pass current page to the template
//             totalPages: totalPages // Pass total pages to the template
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ message: "Server error" });
//     }
// };

const viewSearchLuponDB = async (req, res) => {
    try {
        const name = req.params.search_name;
        const searchWords = name.split(' ').filter(word => word.trim() !== '');

        const orConditions = searchWords.map(word => ({
            $or: [
                { 'RespondentInfo.FirstName': { $regex: new RegExp(word, 'i') } },
                { 'RespondentInfo.LastName': { $regex: new RegExp(word, 'i') } }
            ]
        }));
        
        //Retrieve current status (dropdown selection)
        const selectedLuponStatus = req.query.status || req.session.selectedLuponStatus || "0"; // Default to "0"

        // Prepare the query object
        let query = { $or: orConditions }; // Start with search conditions

        // Filter by status if selectedStatus is specified
        if (selectedLuponStatus !== "0") { // Only filter if not "View All Cases"
            if (selectedLuponStatus === "1") { // Ongoing
                query['Status'] = "Ongoing"; // Assuming "Status" is the field name in your model
            } else if (selectedLuponStatus === "2") { // Resolved
                query['Status'] = "Resolved"; 
            } else if (selectedLuponStatus === "3") { // Archived
                query['isArchived'] = true;  
            }
            // You can add more conditions as needed
        }

        const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
        const casesPerPage = 10; // Number of cases to show per page

        // Fetch the cases for the current page
        const cases = await LuponCaseModel.find(query)
            .skip((page - 1) * LuponCaseModel)
            .limit(casesPerPage)
            .lean();

        const totalCount = await LuponCaseModel.countDocuments(query);
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

// const deleteMultipleTanodCase = async (req, res) => {
//     const selectedCaseIds = req.body.caseIds;
//     try {
//         await LuponCaseModel.deleteMany({ _id : { $in: selectedCaseIds } });

//         res.json({ success: true, message: 'Cases deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error deleting cases', error });
//     }
// };

const deleteMultipleLuponCase = async (req, res) => {
    const selectedCaseIds = req.body.caseIds;
    try {
        await LuponCaseModel.updateMany(
            { _id: { $in: selectedCaseIds } }, 
            { $set: { isArchived: true } }
        );

        res.json({ success: true, message: 'Cases archived successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error archiving cases', error });
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

// const deleteLuponCase = async (req, res) => {
//     try {
//         const caseId = req.params.id;

//         await LuponCaseModel.findByIdAndDelete(caseId);

//         res.redirect("/admin-lupon-db-view");
//     } catch (error) {
//         console.error('Error updating status:', error);
//         return res.status(500).json({ error: 'Failed to update status' });
//     }
// }

const deleteLuponCase = async (req, res) => {
    try {
       const caseId = req.params.id;

       await LuponCaseModel.findOneAndUpdate(
           { _id : caseId},
           { isArchived : true},
           { new: true }
       );

       res.redirect("/admin-lupon-db-view");
    } catch (error) {
       console.error('Error updating status:', error);
       return res.status(500).json({ error: 'Failed to archive' });
    }
}

const restoreRecordLupon = async (req, res) => {
    try {
        const caseId = req.params.id;
        
        await LuponCaseModel.findOneAndUpdate(
            { _id : caseId},
            { isArchived : false},
            { new: true }
        );

        res.redirect("/admin-lupon-db-view");
     } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ error: 'Failed to archive' });
     }
}

const viewAdminArchivedLupon = async (req, res) => {
    try {
        req.session.previousPage = req.session.lastpage;
        req.session.lastpage = '/admin-lupon-archive-view';
        res.render('A-lupon-case-details-archive', {
            layout: 'layout',
            title: 'Admin: Archived Lupon Cases',
            cssFile1: 'homepage',
            cssFile2: 'back-button',
            javascriptFile1: 'case-form'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const viewArchivedLupon = async (req, res) => {
    try {
        req.session.previousPage = req.session.lastpage;
        req.session.lastpage = '/lupon-home';
        res.render('lupon-view-archive-case', {
            layout: 'layout',
            title: 'Admin: Archived Tanod Cases',
            cssFile1: 'homepage'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const viewAdminLuponEventArchive = async (req, res) => {
    try {
        req.session.previousPage = req.session.lastpage;
        req.session.lastpage = '/lupon-home';
        res.render('A-lupon-case-details-archive', {
            layout: 'layout',
            title: 'Admin Lupon: Archived Tanod Cases',
            cssFile1: 'homepage'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    viewLuponDB,
    updateStatus,
    viewLuponCase,
    markResolved,
    deleteLuponCase,
    deleteMultipleLuponCase,
    markMultipleTCaseResolved,
    editLuponCase,
    submitEditLuponCase,
    viewCreateLuponCase,
    createLuponCase,
    searchLuponCase,

    viewSearchLuponDB,
    restoreRecordLupon,
    viewAdminArchivedLupon,
    viewArchivedLupon,

    viewAdminLuponEventArchive
}