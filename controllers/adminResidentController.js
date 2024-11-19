const ResidentModel = require("../models/database/mongoose").ResidentModel;
const UserModel = require("../models/database/mongoose").UserModel;
const CertificateModel = require("../models/database/mongoose").CertificateModel;

//view database ✔
const adminViewResidentDB = async (req, res) => {
    try {
        const status = req.query.status || req.session.selectedStatus || "0"; 
        req.session.selectedStatus = status;
        req.session.lastpage = '/admin-resident-db-view';

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
        res.render('admin-resident-db-view', {
            layout: 'layout',
            title: 'Admin: Resident DB View',
            cssFile1: 'homepage',
            cssFile2: null,
            javascriptFile1: null,
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
//view result of search ✔
const viewSearchAdminResidentDB = async (req, res) => {
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

        res.render('admin-resident-db-view', {
            layout: 'layout',
            title: 'Admin: Resident DB View',
            cssFile1: 'homepage',
            cssFile2: null,
            javascriptFile1: null,
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
//view register/create new unique record page ✔
const adminRegisterResident = async (req, res) => {
    try {
        req.session.lastpage = '/admin-register-resident';
        res.render('admin-register-resident', {
            layout: 'layout',
            title: 'Admin: Create Resident Detail',
            cssFile1: null
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}
//view specific resident ✔
const adminViewSpecificResident = async (req, res) => {
    try {
        const residentID = req.params.id;
        req.session.previousPage = req.session.lastpage;
        req.session.lastpage = `/admin-view-resident/${residentID}`;

        const specificResident = await ResidentModel.findOne({ _id : residentID }).lean();
        
        res.render('admin-view-resident', {
            layout: 'layout',
            title: 'Admin: View Resident Detail',
            cssFile1: 'homepage',
            residents: specificResident
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

//not needed--------------------------------------------
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
//------------------------------------------------------

//view edit page ✔
const adminEditResident = async (req, res) => {
    try {
        const residentID = req.params.id;
        req.session.lastpage = `/admin-edit-resident/${residentID}`;

        const specificResident = await ResidentModel.findOne({ _id : residentID}).lean();

        res.render('admin-edit-resident', {
            layout: 'layout',
            title: 'Admin: Edit Resident Record',
            cssFile1: 'homepage',
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
            residents: specificResident
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

//archive resident ✔
const archiveResidentRecord_Admin = async (req, res) => {
    try {
        const residentID = req.params.id;
 
        await ResidentModel.findOneAndUpdate(
            { _id : residentID},
            { isArchived : true},
            { new: true }
        );
 
        res.redirect("/admin-resident-db-view");
     } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ error: 'Failed to archive' });
     }
}
//search specific resident record ✔
const searchResidentRecord_Admin = async (req, res) => {
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
//actual create ✔
const createResidentRecordAdmin = async (req, res) => {
    try {
        const {
            img,
            FirstName,
            MiddleInitial,
            LastName,
            Age,
            Email,
            Birthday,
            Sex,
            Address,
            isSeniorCitizen,
            ContactNo,
            CivilStatus,
            NoOfResident,
            HousingInfo,
            ServiceRequestID

        } = req.body;

        // _id
        // Find all cases and convert _id to integers for sorting
        const allResidents = await ResidentModel.find().exec();
        const residentIds = allResidents.map(caseDoc => parseInt(caseDoc._id, 10)).filter(id => !isNaN(id));

        // Get the highest _id
        const latestIdNum = residentIds.length > 0 ? Math.max(...residentIds) : 0;
        const newReviewId = (latestIdNum + 1).toString();
        
        console.log(newReviewId);

        // find if email exists in ResidentModel. If so increment req_counter of ResidentModel
        const emailCount = await CertificateModel.countDocuments({ Email: Email });

        await ResidentModel.create({
            _id: newReviewId,
            img: img,
            FirstName: FirstName,
            MiddleInitial: MiddleInitial,
            LastName: LastName,
            Age: Age,
            Email: Email,
            Birthday: Birthday,
            Sex: Sex,
            Address: Address,
            isSeniorCitizen: isSeniorCitizen,
            ContactNo: ContactNo,
            CivilStatus: CivilStatus,
            NoOfResident: NoOfResident,
            HousingInfo: HousingInfo,
            ServiceRequestID: ServiceRequestID ? ServiceRequestID : null,
            isArchived: false,
            Req_counter: emailCount || 0
        });

        res.redirect("/admin-resident-db-view" );
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error Here" });
    }
};
//restore archived resident's info ✔
const restoreResidentRecord_Admin = async (req, res) => {
    try {
        const residentID = req.params.id;

        await ResidentModel.findOneAndUpdate(
            { _id : residentID},
            { isArchived : false},
            { new: true }
        );

        res.redirect("/admin-resident-db-view");
     } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ error: 'Failed to archive' });
     }
};
//submit edit ✔
const submitEditAdminResident = async (req, res) => {
    try {
        const {
            _id,
            img,
            FirstName,
            MiddleInitial,
            LastName,
            Age,
            Email,
            Birthday,
            Sex,
            Address,
            isSeniorCitizen,
            ContactNo,
            CivilStatus,
            NoOfResident,
            HousingInfo,
            ServiceRequestID,

            prevEmail
        } = req.body;

        await ResidentModel.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    img: img,
                    FirstName: FirstName,
                    MiddleInitial: MiddleInitial,
                    LastName: LastName,
                    Age: Age,
                    Email: Email,
                    Birthday: Birthday,
                    Sex: Sex,
                    Address: Address,
                    isSeniorCitizen: isSeniorCitizen,
                    ContactNo: ContactNo,
                    CivilStatus: CivilStatus,
                    NoOfResident: NoOfResident,
                    HousingInfo: HousingInfo,
                    ServiceRequestID: ServiceRequestID ? ServiceRequestID : null,
                }
            },
            { new: true }
        );

        await UserModel.findOneAndUpdate(
            { email: prevEmail },
            {
                $set: {
                    email: Email,
                }
            },
            { new: true }
        );

        res.redirect(`/admin-view-resident/${_id}`);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const checkEmailAdmin = async (req, res) => {
    try {
        const { Email } = req.body;
        const existingResident = await ResidentModel.findOne({ Email }).exec();
        if (existingResident) {
            return res.status(200).json({ exists: true });
        }
        return res.status(200).json({ exists: false });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const checkEmailEditAdmin = async (req, res) => {
    try {
        const { Email, _id } = req.body;
        const existingResident = await ResidentModel.findOne({ Email, _id: { $ne: _id } }).exec();
        if (existingResident) {
            return res.status(200).json({ exists: true });
        }
        return res.status(200).json({ exists: false });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


module.exports = {
    adminViewResidentDB,
    viewSearchAdminResidentDB,
    adminRegisterResident,
    adminViewSpecificResident,

    adminViewArchiveResident,

    adminEditResident,
    archiveResidentRecord_Admin,
    searchResidentRecord_Admin,
    createResidentRecordAdmin,
    restoreResidentRecord_Admin,
    submitEditAdminResident,

    checkEmailAdmin,
    checkEmailEditAdmin
}