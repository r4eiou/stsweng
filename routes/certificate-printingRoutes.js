const express = require('express');
const certificateController = require('../controllers/CertificateController');
const router = express.Router();

router.get('/employee-check-clearance', certificateController.viewCertClearance);

router.get('/search-cases-employee/:search_name',           certificateController.isClearedEmployee);
router.get('/search-cases-employeeLupon/:search_name',      certificateController.isClearedEmployeeLupon);

router.get('/employee-onClick-print/:FN/:MI/:LN',           certificateController.onClickView);

router.get('/employee-input-page',                          certificateController.printCertificate);
router.get('/employee-input-page-clearance',                certificateController.printCertificateClearance);

//for certificate database
router.post('/saveCertificate',                             certificateController.submitCertificate);
router.get('/certificate-db',                               certificateController.viewCertificateDB);
router.get('/certificate-view/:id',                         certificateController.viewSpecificCertificate);
router.get('/certificate-edit/:id',                         certificateController.editSpecificCertificate);
router.post('/submit-edit-certificate',                     certificateController.submitEditSpecificCert);
router.get('/delete-certificate/:id',                       certificateController.deleteCertificate);
router.get('/search-cases-certificate/:search_name',        certificateController.searchCertificateCase);
router.get('/certificate-db/:search_name',                  certificateController.viewSearchCertificateDB);

router.post('/check-cedula',                                certificateController.checkCedulaNum);

module.exports = router;