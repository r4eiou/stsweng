const express = require('express');
const LoginSignupController = require('../controllers/LoginSignupController');
const router = express.Router();

router.get('/login',            LoginSignupController.login);

router.post('/check-login',     LoginSignupController.checkLogin);

router.get('/signup',           LoginSignupController.signup);

router.post('/check-signup',    LoginSignupController.checkSignup);

router.post('/check-user-role', LoginSignupController.checkUserRole);

//resident
router.get('/resident-index/:email',   LoginSignupController.viewResidentIndex);
router.get('/employee-separate-reg-resident',   LoginSignupController.viewSeparateReg);

module.exports = router;