const express = require('express');
const router = express.Router();
const EventsController = require('../controllers/EventsController');

            //filename for events db view
router.get('/events-db-view',                           EventsController.viewEventsDB);       //main events view db

            //filename for view events (id not included)
// router.get('/view-event/:id',                           EventsController.viewEvent);     //view specific (1) event
            //filename for edit events (id not included)
// router.get('/edit-event/:id',                           EventsController.editEvent);     //edit specific (1) event

            //route ng submit button edit
// router.post('/submit-edit-event',                       EventsController.submitEditEvent); //submit button

            //route ng delete/archive (di ko na alam) button
// router.get('/delete-case/:id',                          EventsController.deleteEvent); //delete button sa specific event view page

            //filename for create events
// router.get('/create-event',                             EventsController.viewCreateEvent); //create event

            //route ng submit button for create 
// router.post('/submit-new-event',                        EventsController.submitCreateEvent); //submit button

module.exports = router;