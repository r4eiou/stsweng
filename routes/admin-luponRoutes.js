const express = require('express');
const luponCaseController = require('../controllers/LuponCaseController');
const router = express.Router();

router.get('/admin-lupon-db-view',              luponCaseController.viewLuponDB);

router.get('/admin-lupon-db-view/:search_name', luponCaseController.viewSearchLuponDB);

router.get('/update-Status-Lupon/:id/:status/:currentPage',  luponCaseController.updateStatus);

router.get('/A-lupon-create-case',              luponCaseController.viewCreateLuponCase);

router.post('/submit-lupon-case',               luponCaseController.createLuponCase);

router.post('/mark-as-resolved-lupon',          luponCaseController.markMultipleTCaseResolved);

router.post('/delete-cases-lupon',              luponCaseController.deleteMultipleTanodCase);

router.get('/search-cases-lupon/:search_name',  luponCaseController.searchLuponCase);

router.get('/A-lupon-view-case/:id',            luponCaseController.viewLuponCase);

router.get('/mark-resolved/:id',          luponCaseController.markResolved);

router.get('/A-lupon-edit-case/:id',            luponCaseController.editLuponCase);

router.post('/submit-edit-lupon-case',          luponCaseController.submitEditLuponCase);

router.get('/delete-case-lupon/:id',            luponCaseController.deleteLuponCase);

module.exports = router;