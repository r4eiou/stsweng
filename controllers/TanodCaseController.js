const TanodCaseModel = require("../models/database/mongoose").TanodCaseModel;

//di nagamit
// const viewTanodDB = async (req, res) => {
//     try {
//         req.session.lastpage = '/admin-tanod-db-view';
//         const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
//         const casesPerPage = 10; // Number of cases to show per page

//         const totalCases = await TanodCaseModel.countDocuments(); // Get total number of cases
//         const totalPages = Math.ceil(totalCases / casesPerPage); // Calculate total pages

//         // Fetch the cases for the current page
//         const cases = await TanodCaseModel.find({})
//             .skip((page - 1) * casesPerPage)
//             .limit(casesPerPage)
//             .lean();

//         res.render('admin-tanod-db-view', {
//             layout: 'layout',
//             title: 'Admin: Tanod DB viewing',
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
// };
//

const viewTanodDB = async (req, res) => {
    const status = req.query.status || req.session.selectedStatus || "0"; 
    req.session.selectedStatus = status;
    req.session.lastpage = '/admin-tanod-db-view';

    var page = parseInt(req.query.page) || 1; 
    const casesPerPage = 10; // Number of cases to show per page

    let cases;
    let totalCases;

    // console.log(status); //debugging

    if (status === "0") {
        // View All Cases (archived cases not included)
        totalCases = await TanodCaseModel.countDocuments({isArchived: false}); // Get total number of all cases
        cases = await TanodCaseModel.find({isArchived: false})
            .skip((page - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();

    } else if (status === "1") {
        // View Ongoing Cases na hindi pa nadedelete
        totalCases = await TanodCaseModel.countDocuments({ Status: "Ongoing", isArchived: false }); // Count only ongoing cases
        if (totalCases <= 10) {
            page = 1
        }
        cases = await TanodCaseModel.find({ Status: "Ongoing", isArchived: false })
            .skip((page - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();
    } else if (status === "2") {
        // View Resolved Cases na hindi pa nadedelete
        if (totalCases <= 10) {
            page = 1
        }
        totalCases = await TanodCaseModel.countDocuments({ Status: "Resolved", isArchived: false }); // Count only resolved cases
        cases = await TanodCaseModel.find({ Status: "Resolved", isArchived: false })
            .skip((page - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();
    } else if (status === "3") {
        // View Archived Cases
        if (totalCases <= 10) {
            page = 1
        }
        totalCases = await TanodCaseModel.countDocuments({ isArchived: true }); // Count only archived cases
        cases = await TanodCaseModel.find({ isArchived: true })
            .skip((page - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();
    }

    const totalPages = Math.ceil(totalCases / casesPerPage); // Calculate total pages

    res.render('admin-tanod-db-view', {
        layout: 'layout',
        title: 'Admin: Tanod DB Viewing',
        cssFile1: 'homepage',
        cssFile2: 'db-view',
        javascriptFile1: 'components',
        javascriptFile2: 'header',
        cases: cases, 
        currentPage: page,
        totalPages: totalPages 
    });
};

//old ver
// const viewSearchTanodDB = async (req, res) => {
//     try {
//         const name = req.params.search_name;
//         const searchWords = name.split(' ').filter(word => word.trim() !== '');

//         const orConditions = searchWords.map(word => ({
//             $or: [
//                 { 'ReporteeInfo.FirstName': { $regex: new RegExp(word, 'i') } },
//                 { 'ReporteeInfo.LastName': { $regex: new RegExp(word, 'i') } }
//             ]
//         }));
        
//         const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
//         const casesPerPage = 10; // Number of cases to show per page

//         // Fetch the cases for the current page
//         const cases = await TanodCaseModel.find({ $or: orConditions })
//             .skip((page - 1) * casesPerPage)
//             .limit(casesPerPage)
//             .lean();

//         const totalCount = await TanodCaseModel.countDocuments({ $or: orConditions });
//         const totalPages = Math.ceil(totalCount / casesPerPage); // Calculate total pages

//         res.render('admin-tanod-db-view', {
//             layout: 'layout',
//             title: 'Admin: Tanod DB viewing',
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
// };

const viewSearchTanodDB = async (req, res) => {
    try {
        const name = req.params.search_name;
        const searchWords = name.split(' ').filter(word => word.trim() !== '');

        const orConditions = searchWords.map(word => ({
            $or: [
                { 'ReporteeInfo.FirstName': { $regex: new RegExp(word, 'i') } },
                { 'ReporteeInfo.LastName': { $regex: new RegExp(word, 'i') } }
            ]
        }));

        //Retrieve current status (dropdown selection)
        const selectedStatus = req.query.status || req.session.selectedStatus || "0"; // Default to "0"

        // Prepare the query object
        let query = { $or: orConditions }; // Start with search conditions

        // Filter by status if selectedStatus is specified
        if (selectedStatus !== "0") { // Only filter if not "View All Cases"
            if (selectedStatus === "1") { // Ongoing
                query['Status'] = "Ongoing"; // Assuming "Status" is the field name in your model
            } else if (selectedStatus === "2") { // Resolved
                query['Status'] = "Resolved"; 
            } else if (selectedStatus === "3") { // Archived
                query['isArchived'] = true; 
            }
            // You can add more conditions as needed
        }

        const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
        const casesPerPage = 10; // Number of cases to show per page

        // Fetch the cases for the current page based on the query
        const cases = await TanodCaseModel.find(query)
            .skip((page - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();

        const totalCount = await TanodCaseModel.countDocuments(query);
        const totalPages = Math.ceil(totalCount / casesPerPage); // Calculate total pages

        res.render('admin-tanod-db-view', {
            layout: 'layout',
            title: 'Admin: Tanod DB viewing',
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

//to be fixed
const markResolved = async (req, res) => {
    try {
        const caseId = req.params.id;
        const specificCase = await TanodCaseModel.findOne({ _id : caseId }).lean();
        // console.log(cases);
        
        //update status to "Resolved"
        specificCase.Status = "Resolved";

        await TanodCaseModel.findOneAndUpdate(
            { _id : caseId },
            {
                $set: {
                    Status: "Resolved"
                }
            },
            { new: true }
        );

        // Render the updated view
        res.redirect("/admin-tanod-db-view");

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const viewTanodCase = async (req, res) => {
    try {
        const caseId = req.params.id;
        req.session.lastpage = `/A-tanod-view-case/${caseId}`;
        const specificCase = await TanodCaseModel.findOne({ _id : caseId }).lean();
        // console.log(cases);
        res.render('A-tanod-view-case',{
            layout: 'layout',
            title: 'Barangay Parang - Admin - Tanod View Case Page',
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

const editTanodCase = async (req, res) => {
    try {
        const caseId = req.params.id;
        req.session.lastpage = `/A-tanod-edit-case/${caseId}`;
        const specificCase = await TanodCaseModel.findOne({ _id : caseId }).lean();

        res.render('A-tanod-edit-case',{
            layout: 'layout',
            title: 'Barangay Parang - Admin - Tanod Edit Case Page',
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

const submitEditTanodCase = async (req, res) => {
    try {
        const {
            _id,
            EntryNo,
            Date,
            Status,
            reporteeLastName,
            reporteeMiddleInitial,
            reporteeFirstName,
            reporteeAddress,
            natureOfBlotter,
            respondentLastName,
            respondentMiddleInitial,
            respondentFirstName,
            deskOfficerLastName,
            deskOfficerMiddleInitial,
            deskOfficerFirstName,
            witnessLastName,
            witnessMiddleInitial,
            witnessFirstName,
            location
        } = req.body;

        await TanodCaseModel.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    EntryNo: EntryNo,
                    Date: Date,
                    Status: Status,
                    ReporteeInfo: {
                        FirstName: reporteeFirstName,
                        MiddleInitial: reporteeMiddleInitial,
                        LastName: reporteeLastName,
                        Address: reporteeAddress
                    },
                    natureOfBlotter: natureOfBlotter,
                    RespondentInfo: {
                        FirstName: respondentFirstName,
                        MiddleInitial: respondentMiddleInitial,
                        LastName: respondentLastName
                    },
                    DeskOfficerInfo: {
                        FirstName: deskOfficerFirstName,
                        MiddleInitial: deskOfficerMiddleInitial,
                        LastName: deskOfficerLastName
                    },
                    WitnessInfo: {
                        FirstName: witnessFirstName,
                        MiddleInitial: witnessMiddleInitial,
                        LastName: witnessLastName
                    },
                    Location: location
                }
            },
            { new: true }
        );

        res.redirect(`/A-tanod-view-case/${_id}`);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const updateStatus = async (req, res) => {
    try {
        const caseId = req.params.id;
        const currentPage = Number(req.params.currentPage) || 1;
        const currentStatus = req.params.status; 

        const newStatus = currentStatus === 'Resolved' ? 'Ongoing' : 'Resolved';

        await TanodCaseModel.findOneAndUpdate(
            { _id : caseId},
            { Status : newStatus},
            { new: true }
        );

        res.redirect(`/admin-tanod-db-view?page=${currentPage}`);

    } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ error: 'Failed to update status' });
    }
}

//old ver
// const deleteTanodCase = async (req, res) => {
//     try {
//         const caseId = req.params.id;

//         await TanodCaseModel.findByIdAndDelete(caseId);

//         res.redirect("/admin-tanod-db-view");
//     } catch (error) {
//         console.error('Error updating status:', error);
//         return res.status(500).json({ error: 'Failed to update status' });
//     }
// }

const deleteTanodCase = async (req, res) => {
     try {
        const caseId = req.params.id;

        await TanodCaseModel.findOneAndUpdate(
            { _id : caseId},
            { isArchived : true},
            { new: true }
        );

        res.redirect("/admin-tanod-db-view");
     } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ error: 'Failed to archive' });
     }
}

//old ver
// const deleteMultipleTanodCase = async (req, res) => {
//     const selectedCaseIds = req.body.caseIds;
//     try {
//         await TanodCaseModel.deleteMany({ _id : { $in: selectedCaseIds } });

//         res.json({ success: true, message: 'Cases deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Error deleting cases', error });
//     }
// };

const deleteMultipleTanodCase = async (req, res) => {
    const selectedCaseIds = req.body.caseIds;
    try {
        await TanodCaseModel.updateMany(
            { _id: { $in: selectedCaseIds } }, 
            { $set: { isArchived: true } }
        );

        res.json({ success: true, message: 'Cases archived successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error archiving cases', error });
    }
};

const markMultipleTCaseResolved = async (req, res) => {
    const selectedCaseIds = req.body.caseIds;
    
    try {
        const updateResult = await TanodCaseModel.updateMany(
            { _id: { $in: selectedCaseIds } },
            { $set: { Status: "Resolved" } }
        );
        
        res.json({ success: true, message: 'Cases resolved successfully' });
        
    } catch (error) {
        console.error("Error updating cases:", error);
        res.status(500).json({ success: false, message: 'Error updating cases', error });
    }
};

const searchTanodCase = async (req, res) => {
    const searchName = req.params.search_name;
    console.log(searchName); //Returns Juan Dela Cruz
    const searchWords = searchName.split(' ').filter(word => word.trim() !== '');

    try {
        
        const orConditions = searchWords.map(word => ({
            $or: [
                { 'ReporteeInfo.FirstName': { $regex: new RegExp(word, 'i') } },
                { 'ReporteeInfo.LastName': { $regex: new RegExp(word, 'i') } }
            ]
        }));

        // Find documents matching any of the $or conditions
        const searchResults = await TanodCaseModel.find({ $or: orConditions }).lean().exec();
        //count search Results

        res.json({ success: true, results: searchResults });

    } catch (error) {
        console.error('Error searching cases:', error);
        res.status(500).json({ success: false, message: 'Error searching cases', error });
    }
};

const viewCreateTanodCase = async (req, res) => {
    try {
        const caseId = req.params.id;
        req.session.lastpage = '/A-tanod-create-case';
        const specificCase = await TanodCaseModel.findOne({ _id : caseId }).lean();

        res.render('A-tanod-create-case',{
            layout: 'layout',
            title: 'Barangay Parang - Admin - Tanod Create Case Page',
            cssFile1: 'index',
            cssFile2: 'form',
            javascriptFile1: 'header-hbs',
            javascriptFile2: 'case-form',
            cases: specificCase,
            message: ''
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const createTanodCase = async (req, res) => {
    try {
        const {
            EntryNo,
            Date,
            Status,
            reporteeLastName,
            reporteeMiddleInitial,
            reporteeFirstName,
            reporteeAddress,
            natureOfBlotter,
            respondentLastName,
            respondentMiddleInitial,
            respondentFirstName,
            deskOfficerLastName,
            deskOfficerMiddleInitial,
            deskOfficerFirstName,
            witnessLastName,
            witnessMiddleInitial,
            witnessFirstName,
            location
        } = req.body;

        // Check for existing Entry Number
        const existingCase = await TanodCaseModel.findOne({ EntryNo }).lean();
        if (existingCase) {
            return res.status(400).json({ message: 'Entry Number already exists.'});
        }


        // _id
        // Find all cases and convert _id to integers for sorting
        const allCases = await TanodCaseModel.find().exec();
        const caseIds = allCases.map(caseDoc => parseInt(caseDoc._id, 10)).filter(id => !isNaN(id));

        // Get the highest _id
        const latestIdNum = caseIds.length > 0 ? Math.max(...caseIds) : 0;
        const newReviewId = (latestIdNum + 1).toString();
        
        console.log(newReviewId);

        await TanodCaseModel.create({
            _id: newReviewId,
            EntryNo: EntryNo,
            Date: Date,
            Status: Status,
            ReporteeInfo: {
                FirstName: reporteeFirstName,
                MiddleInitial: reporteeMiddleInitial,
                LastName: reporteeLastName,
                Address: reporteeAddress
            },
            natureOfBlotter: natureOfBlotter,
            RespondentInfo: {
                FirstName: respondentFirstName,
                MiddleInitial: respondentMiddleInitial,
                LastName: respondentLastName
            },
            DeskOfficerInfo: {
                FirstName: deskOfficerFirstName,
                MiddleInitial: deskOfficerMiddleInitial,
                LastName: deskOfficerLastName
            },
            WitnessInfo: {
                FirstName: witnessFirstName,
                MiddleInitial: witnessMiddleInitial,
                LastName: witnessLastName
            },
            Location: location,
            isArchived: false
        });

        res.redirect("/admin-tanod-db-view" );
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error Here" });
    }
};

// Endpoint to check for duplicate EntryNo
const checkEntryNo = async (req, res) => {
    try {
        const { EntryNo } = req.body;
        const existingCase = await TanodCaseModel.findOne({ EntryNo }).lean();
        if (existingCase) {
            return res.status(200).json({ exists: true });
        }
        return res.status(200).json({ exists: false });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const restoreRecord = async (req, res) => {
    try {
        const caseId = req.params.id;

        await TanodCaseModel.findOneAndUpdate(
            { _id : caseId},
            { isArchived : false},
            { new: true }
        );

        res.redirect("/admin-tanod-db-view");
     } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ error: 'Failed to archive' });
     }
}

module.exports = {
    viewTanodDB,
    viewTanodCase,
    markResolved,
    editTanodCase,
    submitEditTanodCase,
    updateStatus,
    deleteTanodCase,
    deleteMultipleTanodCase,
    markMultipleTCaseResolved,
    searchTanodCase,
    viewCreateTanodCase,
    createTanodCase,
    checkEntryNo,

    viewSearchTanodDB,
    restoreRecord
}

