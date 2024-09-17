const express = require('express');
const accountsController = require('../controllers/UserController');
const router = express.Router();

router.get('/admin-accounts-db-view',           accountsController.viewAllAccounts);
router.get('/admin-accounts-db-view-security',  accountsController.viewAllAccountsSecurity);

//ADMIN
router.get('/admin-view-acct-admin/:id',        accountsController.viewAdminAcc);
router.get('/admin-edit-acct-admin/:id',        accountsController.editAdminAcc);
router.post('/submit-edit-admin-acc',           accountsController.submitEditAdminAcc);
router.get('/create-acc',                       accountsController.createAccount);
router.post('/submit-create-acc',               accountsController.submitCreateAcc);


//EMPLOYEE
router.get('/admin-view-acct-employee/:id',     accountsController.viewEmployeeAcc);
router.get('/admin-edit-acct-employee/:id',     accountsController.editEmployeeAcc);
router.post('/submit-edit-employee-acc',        accountsController.submitEditEmployeeAcc);


//LUPON
router.get('/admin-view-acct-lupon/:id',        accountsController.viewLuponAcc);
router.get('/admin-edit-acct-lupon/:id',        accountsController.editLuponAcc);
router.post('/submit-edit-lupon-acc',           accountsController.submitEditLuponAcc);


//TANOD
router.get('/admin-view-acct-tanod/:id',        accountsController.viewTanodAcc);
router.get('/admin-edit-acct-tanod/:id',        accountsController.editTanodAcc);
router.post('/submit-edit-tanod-acc',           accountsController.submitEditTanodAcc);


module.exports = router;