const express = require('express');
const userController = require('../controllers/UserController');
const router = express.Router();

router.get('/admin-resident-db-view',       userController.adminViewResidentDB);
router.get('/admin-register-resident',      userController.adminRegisterResident);
router.get('/admin-view-resident',          userController.adminViewResident);
router.get('/admin-view-archive-resident',  userController.adminViewArchiveResident);
router.get('/admin-edit-resident',          userController.adminEditResident);

module.exports = router;