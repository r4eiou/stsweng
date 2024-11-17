const express = require('express');
const employeeResidentController = require('../controllers/employeeResidentController');
const router = express.Router();

router.get('/employee-resident-db',                 employeeResidentController.employeeViewResidentDB);             //view databasex
router.get('/employee-resident-db/:search_name',    employeeResidentController.viewSearchEmployeeResidentDB);       //view search result in db

router.get('/employee-register-resident',           employeeResidentController.employeeRegisterResident);           //view create new record page
router.get('/employee-view-resident/:id',           employeeResidentController.employeeViewSpecificResident);       // view specific resident
router.get('/admin-view-archive-resident',          employeeResidentController.adminViewArchiveResident);
router.get('/employee-edit-resident/:id',           employeeResidentController.employeeEditResident);               //view edit page

router.get('/archive-resident-info/:id',            employeeResidentController.archiveResidentRecord);              //delete resident info
router.get('/search-resident/:search_name',         employeeResidentController.searchResidentRecord);               //search
router.post('/submit-resident-employee',            employeeResidentController.createResidentRecordEmployee);       //create
router.get('/restore-resident-employee/:id',        employeeResidentController.restoreResidentRecord_Employee);     //restore record

router.post('/submit-edit-resident-employee',       employeeResidentController.submitEditEmployeeResident);

router.post('/check-email-exists-employee',         employeeResidentController.checkEmailEmployee);
router.post('/check-email-exists-employeeEdit',     employeeResidentController.checkEmailEditEmployee);

module.exports = router;