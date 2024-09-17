const express = require('express');
const tanodCaseController = require('../controllers/TanodCaseController');
const router = express.Router();

router.get('/admin-tanod-db-view',                      tanodCaseController.viewTanodDB);       //main view db

//router.get('/admin-tanod-db-view/:page',                tanodCaseController.viewPageTanodDB);   //view specific page in db //idk where i used this, but it ruins admin tanod search

router.get('/admin-tanod-db-view/:search_name',         tanodCaseController.viewSearchTanodDB); //view search result in db

router.get('/tanod-markResolved/:id',                  tanodCaseController.markResolved);      //mark specific case/s using mark resolved button in db

router.get('/A-tanod-view-case/:id',                    tanodCaseController.viewTanodCase);     //view specific (1) case

router.get('/A-tanod-edit-case/:id',                    tanodCaseController.editTanodCase);     //edit specific (1) case

router.post('/submit-edit-tanod-case',                  tanodCaseController.submitEditTanodCase);

router.get('/update-Status/:id/:status/:currentPage',   tanodCaseController.updateStatus);      //status update

router.get('/delete-case/:id',                          tanodCaseController.deleteTanodCase);

router.post('/mark-as-resolved',                        tanodCaseController.markMultipleTCaseResolved);

router.post('/delete-cases',                            tanodCaseController.deleteMultipleTanodCase);

router.get('/search-cases/:search_name',                tanodCaseController.searchTanodCase);

router.get('/A-tanod-create-case',                      tanodCaseController.viewCreateTanodCase);

router.post('/submit-tanod-case',                       tanodCaseController.createTanodCase);

router.post('/check-entryno', tanodCaseController.checkEntryNo);
module.exports = router;