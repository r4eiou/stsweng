const express = require('express');
const userController = require('../controllers/UserController');
const router = express.Router();

const isAuth = (req, res, next) => {
    if(req.session.isAuth) {
        next();
    }
    else {
        res.redirect('/index');
    }
}

router.get('/admin-login-page',     userController.getLogin);

router.post('/admin-login-page',    userController.isUser);

router.get('/admin-homepage', isAuth, (req, res) => {
    req.session.lastpage = '/admin-homepage';
    res.render('admin-homepage',{
        layout: 'layout',
        title: 'Barangay Parang - Admin Homepage',
        cssFile1: 'index',
        cssFile2: null,
        javascriptFile1: 'header',
        javascriptFile2: null,
    });
})

//SECURITY
router.post('/check-answer',            userController.checkAnswer);

router.post('/submit-new-question',     userController.changeSecurityQuestion);

module.exports = router;