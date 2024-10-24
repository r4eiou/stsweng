const ResidentModel = require("../models/database/mongoose").ResidentModel;

//view database
const employeeViewResidentDB = async (req, res) => {
    try {
        const status = req.query.status || req.session.selectedStatus || "0"; 
        req.session.selectedStatus = status;
        req.session.lastpage = '/employee-resident-db';

        var  page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
        const casesPerPage = 10; // Number of cases to show per page

        
        let residents;
        let totalCases;

        // console.log(status)

        if (status === "0") {
            // View All Residents (including archived ??)
            totalCases = await ResidentModel.countDocuments({}); // Get total number of all cases
            residents = await ResidentModel.find({})
                .skip((page - 1) * casesPerPage)
                .limit(casesPerPage)
                .lean();
    
        } else if (status === "1") {
            // View Registered
            totalCases = await ResidentModel.countDocuments({isArchived: false}); // Count only registred residents
            if (totalCases <= 10) {
                page = 1
            }
            residents = await ResidentModel.find({isArchived: false})
                .skip((page - 1) * casesPerPage)
                .limit(casesPerPage)
                .lean();

        } else if (status === "2") {
            // View Archived info
            if (totalCases <= 10) {
                page = 1
            }
            totalCases = await ResidentModel.countDocuments({isArchived: true}); // Count only resolved cases
            residents = await ResidentModel.find({isArchived: true})
                .skip((page - 1) * casesPerPage)
                .limit(casesPerPage)
                .lean();
        }
        const totalPages = Math.ceil(totalCases / casesPerPage); // Calculate total pages
        res.render('employee-resident-db', {
            layout: 'layout',
            title: 'Employee: Resident DB View',
            cssFile1: 'homepage',
            cssFile2: null,
            javascriptFile1: 'resident',
            javascriptFile2: null,
            residents: residents,
            currentPage: page, // Pass current page to the template
            totalPages: totalPages // Pass total pages to the template
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}
//view result of search
const viewSearchEmployeeResidentDB = async (req, res) => {
    try {
        const name = req.params.search_name;
        const searchWords = name.split(' ').filter(word => word.trim() !== '');

        const orConditions = searchWords.map(word => ({
            $or: [
                { 'FirstName': { $regex: new RegExp(word, 'i') } },
                { 'LastName': { $regex: new RegExp(word, 'i') } }
            ]
        }));
        
        console.log(name)

        const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
        const casesPerPage = 10; // Number of cases to show per page

        // Fetch the cases for the current page
        const residents = await ResidentModel.find({ $or: orConditions })
            .skip((page - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();

        const totalCount = await ResidentModel.countDocuments({ $or: orConditions });
        const totalPages = Math.ceil(totalCount / casesPerPage); // Calculate total pages

        res.render('employee-resident-db', {
            layout: 'layout',
            title: 'Employee: Resident DB View',
            cssFile1: 'homepage',
            cssFile2: null,
            javascriptFile1: 'resident',
            javascriptFile2: null,
            residents: residents,
            currentPage: page, // Pass current page to the template
            totalPages: totalPages // Pass total pages to the template
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const employeeRegisterResident = async (req, res) => {
    try {
        req.session.lastpage = '/employee-register-resident';
        res.render('employee-register-resident', {
            layout: 'layout',
            title: 'Employee: Create Resident Detail',
            cssFile1: null
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}
//view specific resident
const employeeViewSpecificResident = async (req, res) => {
    try {
        const residentID = req.params.id;
        req.session.previousPage = req.session.lastpage;
        req.session.lastpage = `/employee-view-resident/${residentID}`;

        const specificResident = await ResidentModel.findOne({ _id : residentID }).lean();
        
        res.render('employee-view-resident', {
            layout: 'layout',
            title: 'Employee: View Resident Detail',
            cssFile1: 'homepage',
            residents: specificResident
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const adminViewArchiveResident = async (req, res) => {
    try {
        req.session.previousPage = req.session.lastpage;
        req.session.lastpage = '/admin-homepage';
        res.render('admin-view-archive-resident', {
            layout: 'layout',
            title: 'Admin: View Archive Resident Detail',
            cssFile1: 'homepage'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const adminEditResident = async (req, res) => {
    try {
        req.session.previousPage = req.session.lastpage;
        req.session.lastpage = '/admin-homepage';
        res.render('admin-edit-resident', {
            layout: 'layout',
            title: 'Admin: View Archive Resident Detail',
            cssFile1: 'homepage'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

//archive resident
const archiveResidentRecord = async (req, res) => {
    try {
        const residentID = req.params.id;
 
        await ResidentModel.findOneAndUpdate(
            { _id : residentID},
            { isArchived : true},
            { new: true }
        );
 
        res.redirect("/employee-resident-db");
     } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ error: 'Failed to archive' });
     }
}

const searchResidentRecord = async (req, res) => {
    const searchName = req.params.search_name;
    console.log(searchName); //Returns Juan Dela Cruz
    const searchWords = searchName.split(' ').filter(word => word.trim() !== '');

    try {
        
        const orConditions = searchWords.map(word => ({
            $or: [
                { 'FirstName': { $regex: new RegExp(word, 'i') } },
                { 'LastName': { $regex: new RegExp(word, 'i') } }
            ]
        }));

        // Find documents matching any of the $or conditions
        const searchResults = await ResidentModel.find({ $or: orConditions }).lean().exec();
        //count search Results

        res.json({ success: true, results: searchResults });

    } catch (error) {
        console.error('Error searching cases:', error);
        res.status(500).json({ success: false, message: 'Error searching cases', error });
    }
};



module.exports = {
    employeeViewResidentDB,
    viewSearchEmployeeResidentDB,
    employeeRegisterResident,
    employeeViewSpecificResident,

    adminViewArchiveResident,

    adminEditResident,

    archiveResidentRecord,
    searchResidentRecord,
}