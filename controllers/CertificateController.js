const TanodCaseModel = require("../models/database/mongoose").TanodCaseModel;
const LuponCaseModel = require("../models/database/mongoose").LuponCaseModel;
const CertificateModel = require("../models/database/mongoose").CertificateModel;

//employee
const viewCertClearance = async (req, res) => {
    req.session.lastpage = '/employee-check-clearance';
    res.render('employee-check-clearance',{
        layout: 'layout',
        title: 'Barangay Parang - Employee Homepage - test',
        cssFile1: 'index',
        cssFile2: 'checkclearance',
        javascriptFile1: 'header',
        javascriptFile2: 'check-clearance',
    });
};

const isClearedEmployee = async (req, res) => {
    const searchName = req.params.search_name;
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

        res.json({ success: true, results: searchResults });
    } catch (error) {
        console.error('Error searching cases:', error);
        res.status(500).json({ success: false, message: 'Error searching cases', error });
    }
};

const isClearedEmployeeLupon = async (req, res) => {
    const searchName = req.params.search_name;
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

const onClickView = async (req, res) => {
    try {
        const ReporteeInfoFN = req.params.FN;
        const ReporteeInfoMI = req.params.MI;
        const ReporteeInfoLN = req.params.LN;

        console.log(ReporteeInfoFN)
        console.log(ReporteeInfoMI)
        console.log(ReporteeInfoLN)

        var typeCase = ""
        var specificCase = ""
        var statusT = ""
        var statusL = ""

        const specificCaseT = await TanodCaseModel.findOne({ 'ReporteeInfo.FirstName'       : ReporteeInfoFN, 
                                                             'ReporteeInfo.MiddleInitial'   : ReporteeInfoMI,
                                                             'ReporteeInfo.LastName'        : ReporteeInfoLN}).lean();

        const specificCaseL = await LuponCaseModel.findOne({ 'RespondentInfo.FirstName'     : ReporteeInfoFN, 
                                                             'RespondentInfo.MiddleInitial' : ReporteeInfoMI,
                                                             'RespondentInfo.LastName'      : ReporteeInfoLN}).lean();


        if(specificCaseT && specificCaseL) {
            typeCase = "both"
            specificCase = specificCaseT,
            statusT = specificCaseT.Status
            statusL = specificCaseL.Status
        } else if (specificCaseT) {
            typeCase = "tanod"
            specificCase = specificCaseT
            statusT = specificCaseT.Status
            statusL = null
        } else if (specificCaseL) {
            typeCase = "lupon"
            specificCase = specificCaseL
            statusL = specificCaseL.Status
            statusT = null
        }

        req.session.lastpage = `/employee-onClick-print/${ReporteeInfoFN}/${ReporteeInfoMI}/${ReporteeInfoLN}`;
        res.render('employee-onClick-print',{
            layout: 'layout',
            title: 'Barangay Parang - Admin - Tanod View Case Page',
            cssFile1: 'index',
            cssFile2: 'onClick',
            javascriptFile1: 'components',
            javascriptFile2: 'header',
            cases: specificCase,
            typeCase : typeCase,
            StatusT : statusT,
            StatusL : statusL
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const printCertificate = async (req, res) => {
    try {
        req.session.lastpage = '/employee-input-page';
        res.render('employee-input-page', {
            layout: 'layout',
            title: 'Barangay Parang - Employee View - Input Cert. Details',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}; 

const printCertificateClearance = async (req, res) => {
    try {
        req.session.lastpage = '/employee-input-page-clearance';
        res.render('employee-input-page-clearance', {
            layout: 'layout',
            title: 'Barangay Parang - Employee View - Input Cert. Details',
            cssFile1: null,
            cssFile2: null,
            javascriptFile1: null,
            javascriptFile2: null,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}; 

//certificate database
const submitCertificate = async (req, res) => {
    try {
        const {
            name,
            birthday,
            address,
            birthPlace,
            ctc_no,
            ctc_date_issued,
            ctc_location,
            cert_date_issued,
            reason,
            img
        } = req.body;

        //DEBUGGING
        /* 
        console.log('Received data:', {
            name,
            birthday,
            address,
            ctc_no,
            ctc_date_issued,
            ctc_location,
            cert_date_issued,
            reason,
            img
        });
        */

        // _id
        // Find all cases and convert _id to integers for sorting
        const allCases = await CertificateModel.find().exec();
        const caseIds = allCases.map(caseDoc => parseInt(caseDoc._id, 10)).filter(id => !isNaN(id));

        // Get the highest _id
        const latestIdNum = caseIds.length > 0 ? Math.max(...caseIds) : 0;
        const newCertId = (latestIdNum + 1).toString();
        
        // console.log("newcertid", newCertId); //DEBUGGING

        await CertificateModel.create({
            _id: newCertId,
            img: img,
            name: name,
            birthday: birthday,
            birthplace : birthPlace,
            address: address,
            ctc_no: ctc_no,
            ctc_date_issued: ctc_date_issued,
            ctc_location: ctc_location,
            cert_date_issued: cert_date_issued,
            reason: reason
        });

        res.status(201).send({ message: 'Certificate saved successfully' });
    } catch (error) {
        console.log("error here in controller cert")
        res.status(400).send(error);
    }
}

const viewCertificateDB = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
        const casesPerPage = 10; // Number of cases to show per page

        const totalCert = await CertificateModel.countDocuments(); // Get total number of cases
        const totalPages = Math.ceil(totalCert / casesPerPage); // Calculate total pages

        // Fetch the cases for the current page
        const certificate = await CertificateModel.find({})
            .skip((page - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();

        req.session.lastpage = '/certificate-db';    
        res.render('certificate-db', {
            layout: 'layout',
            title: 'Admin: Certificate DB viewing',
            cssFile1: 'homepage',
            cssFile2: 'cert-db-view',
            javascriptFile1: 'components',
            javascriptFile2: 'header',
            certificates: certificate,
            currentPage: page, // Pass current page to the template
            totalPages: totalPages // Pass total pages to the template
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const viewSpecificCertificate = async (req, res) => {
    try {
        const caseId = req.params.id;
        const specificCert = await CertificateModel.findOne({ _id : caseId }).lean();

        // console.log(caseId);
        
        req.session.lastpage = `/certificate-view/${caseId}`;
        res.render('certificate-view', {
            layout: 'layout',
            title: 'Admin: Certificate DB viewing',
            cssFile1: 'homepage',
            cssFile2: 'cert-db-view',
            javascriptFile1: 'components',
            javascriptFile2: 'header',
            certificates: specificCert,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const editSpecificCertificate = async (req, res) => {
    try {
        const caseId = req.params.id;
        const specificCert = await CertificateModel.findOne({ _id : caseId }).lean();

        // console.log(caseId);
        req.session.lastpage = `/certificate-edit/${caseId}`;
        res.render('certificate-edit', {
            layout: 'layout',
            title: 'Admin: Certificate DB viewing',
            cssFile1: 'homepage',
            cssFile2: 'cert-db-view',
            javascriptFile1: 'components',
            javascriptFile2: 'header',
            certificates: specificCert,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

const submitEditSpecificCert = async (req, res) => {
    try {
        const {
            _id,
            name,
            birthday,
            address,
            birthPlace,
            ctc_no,
            ctc_date_issued,
            ctc_location,
            cert_date_issued,
            reason,
            img
        } = req.body;

        //DEBUGGING
        /*
        console.log('Received data:', {
            _id,
            name,
            birthday,
            address,
            ctc_no,
            ctc_date_issued,
            ctc_location,
            cert_date_issued,
            reason,
            img
        });
        */
    
        await CertificateModel.findOneAndUpdate(
            { _id: _id },
            {
                $set: {
                    id: _id,
                    img: img,
                    name: name,
                    birthday: birthday,
                    birthplace : birthPlace,
                    address: address,
                    ctc_no: ctc_no,
                    ctc_date_issued: ctc_date_issued,
                    ctc_location: ctc_location,
                    cert_date_issued: cert_date_issued,
                    reason: reason
                }
            },
            { new: true }
        );
        res.status(201).send({ message: 'Certificate edited successfully' });
    } catch (error) {
        console.log("error here in controller cert")
        res.status(400).send(error);
    }
}

const deleteCertificate = async (req, res) => {
    try {
        const caseId = req.params.id;

        await CertificateModel.findByIdAndDelete(caseId);

        res.redirect("/certificate-db");
    } catch (error) {
        console.error('Error updating status:', error);
        return res.status(500).json({ error: 'Failed to update status' });
    }
}

const searchCertificateCase = async (req, res) => {
    const searchName = req.params.search_name;
    console.log(searchName); //Returns Juan Dela Cruz
    const searchWords = searchName.split(' ').filter(word => word.trim() !== '');

    try {
        
        const orConditions = searchWords.map(word => ({
            $or: [
                { 'name': { $regex: new RegExp(word, 'i') } }
            ]
        }));

        // Find documents matching any of the $or conditions
        const searchResults = await CertificateModel.find({ $or: orConditions }).lean().exec();
        //count search Results

        res.json({ success: true, results: searchResults });

    } catch (error) {
        console.error('Error searching cases:', error);
        res.status(500).json({ success: false, message: 'Error searching cases', error });
    }
};

const viewSearchCertificateDB = async (req, res) => {
    try {
        console.log("checking if I'm here");
    
        // Get search query and handle empty cases
        const name = req.params.search_name || ''; // Use query params for GET request
        console.log("name: ", name);
        const searchWords = name.split(' ').filter(word => word.trim() !== '');
    
        // Construct the search query
        const orConditions = searchWords.map(word => ({
            'name': { $regex: new RegExp(word, 'i') } // Case-insensitive search
        }));
        const query = { $or: orConditions };
    
        // Pagination settings
        const page = parseInt(req.query.page, 10) || 1; // Get the current page from query params, default to 1
        const casesPerPage = 10; // Number of cases to show per page
    
        // Fetch the cases for the current page with search conditions
        const certificates = await CertificateModel.find(query)
            .skip((page - 1) * casesPerPage)
            .limit(casesPerPage)
            .lean();
    
        // Count total documents that match the search query
        const totalCount = await CertificateModel.countDocuments(query);
        const totalPages = Math.ceil(totalCount / casesPerPage); // Calculate total pages
    
        // Render the view with pagination data and search results
        res.render('certificate-db', {
            layout: 'layout',
            title: 'Admin: Certificate DB Viewing',
            cssFile1: 'homepage',
            cssFile2: 'cert-db-view',
            javascriptFile1: 'components',
            javascriptFile2: 'header',
            certificates: certificates,
            currentPage: page, // Pass current page to the template
            totalPages: totalPages // Pass total pages to the template
        });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: "Server error" });
    }
    
};

const checkCedulaNum = async (req, res) => {
    console.log("checking cedula")
    const { cedula } = req.body;
    try {
        const existingCedula = await CertificateModel.findOne({ ctc_no: cedula });
        if (existingCedula) {
            return res.json({ exists: true });
        }
        return res.json({ exists: false });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    isClearedEmployee,
    onClickView,
    printCertificate,
    viewCertClearance,

    isClearedEmployeeLupon,
    printCertificateClearance,

    submitCertificate,
    viewCertificateDB,
    viewSpecificCertificate,
    editSpecificCertificate,
    submitEditSpecificCert,
    deleteCertificate,
    searchCertificateCase,
    viewSearchCertificateDB,
    checkCedulaNum
}