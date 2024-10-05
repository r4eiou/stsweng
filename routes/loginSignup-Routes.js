const express = require('express');
const LoginSignupController = require('../controllers/LoginSignupController');
const router = express.Router();

router.get('/login',        LoginSignupController.login);
router.post('/check-login', LoginSignupController.checkLogin);

router.get('/signup',       LoginSignupController.signup)



module.exports = router;