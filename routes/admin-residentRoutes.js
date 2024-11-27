const express = require('express');
const adminResidentController = require('../controllers/adminResidentController');
const router = express.Router();

router.get('/admin-resident-db-view',               adminResidentController.adminViewResidentDB);             //view databasex
router.get('/admin-resident-db-view/:search_name',  adminResidentController.viewSearchAdminResidentDB);       //view search result in db

router.get('/admin-register-resident',              adminResidentController.adminRegisterResident);           //view create new record page
router.get('/admin-view-resident/:id',              adminResidentController.adminViewSpecificResident);       // view specific resident

//not needed
// router.get('/admin-view-archive-resident',          adminResidentController.adminViewArchiveResident);
//

router.get('/admin-edit-resident/:id',              adminResidentController.adminEditResident);               //view edit page

router.get('/admin-archive-resident-info/:id',      adminResidentController.archiveResidentRecord_Admin);     //delete resident info
router.get('/admin-search-resident/:search_name',   adminResidentController.searchResidentRecord_Admin);      //search
router.post('/submit-resident-admin',               adminResidentController.createResidentRecordAdmin);       //create
router.get('/restore-resident-admin/:id',           adminResidentController.restoreResidentRecord_Admin);     //restore record

router.post('/submit-edit-resident-admin',          adminResidentController.submitEditAdminResident);

router.post('/check-email-exists',                  adminResidentController.checkEmailAdmin);
router.post('/check-email-exists-adminEdit',        adminResidentController.checkEmailEditAdmin);

module.exports = router;