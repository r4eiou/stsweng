const express = require('express');
const userController = require('../controllers/UserController');
const router = express.Router();

const {EventModel } = require('../models/database/mongoose');


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

router.get('/admin-index', isAuth, async (req, res) => {
    try{
        
        //proceed to get all events
        const events = await EventModel.find({ isArchived: false, isInactive: false })
            .sort({ start_date: 1 }) // Optional: Sort by start_date
           
    
        let allEvents = [];
            for(const item of events){
                let stat_lc = 'active';
                let stat = 'Active';
                let isEditable = 'hidden';
                if(item.isInactive){
                    stat_lc = 'inactive';
                    isEditable = '';
                    stat = 'Inactive';
                }

                allEvents.push({
                    eventID : item._id,
                    headline: item.header,
                    start_date: item.start_date,
                    end_date: item.end_date,
                    details: item.details,
                    pic: item.pic,
                    status: item.Status,
                    stat_lc: stat_lc,
                    stat: stat,
                    isEditable: isEditable
                });
            }

            req.session.lastpage = '/admin-index';
            res.render('admin-index',{
                layout: 'layout',
                title: 'Admin Index',
                cssFile1: 'index',
                cssFile2: null,
                javascriptFile1: 'header',
                javascriptFile2: null,
                events: allEvents,
            });
        
    }catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
    
})

router.get('/admin-homepage', isAuth, (req, res) => {
    req.session.lastpage = '/admin-homepage';
    res.render('admin-homepage',{
        layout: 'layout',
        title: 'Barangay Parang - Admin Dashboard',
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