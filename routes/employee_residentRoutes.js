const express = require('express');
const employeeResidentController = require('../controllers/employeeResidentController');
const router = express.Router();

router.get('/employee-resident-db',                 employeeResidentController.employeeViewResidentDB);             //view databasex
router.get('/employee-resident-db/:search_name',    employeeResidentController.viewSearchEmployeeResidentDB); //view search result in db

router.get('/employee-register-resident',           employeeResidentController.employeeRegisterResident);              //create new record
router.get('/employee-view-resident/:id',           employeeResidentController.employeeViewSpecificResident);       // view specific resident
router.get('/admin-view-archive-resident',          employeeResidentController.adminViewArchiveResident);
router.get('/admin-edit-resident',                  employeeResidentController.adminEditResident);

router.get('/archive-resident-info/:id',            employeeResidentController.archiveResidentRecord);              //delete resident info
router.get('/search-resident/:search_name',         employeeResidentController.searchResidentRecord);               //ssearch

module.exports = router;