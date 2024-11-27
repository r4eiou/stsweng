const { CertificateModel, UserModel, LuponCaseModel, TanodCaseModel, EventModel } = require('../models/database/mongoose');

//Set up for multer
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage();
const upload = multer({storage});


const isAuth = (req, res, next) => {
    if(req.session.isAuth) {
        next();
    }
    else {
        res.redirect('/index');
    }
}

function add(app){
    const mongoose = require('mongoose');


    /************************************************************ADMIN************************************************/
    
    //Admin view events db
    app.get('/admin-view-events-db', isAuth, async function(req, resp){
        try{

                    //update inactive events
                   const currentDate = new Date();
                   const eventsToUpdate = await EventModel.find({ isArchived: false, isInactive: false });
            
                   for(let event of eventsToUpdate){
                       const endDate = new Date(event.end_date);
            
                       if(currentDate > endDate){
                           event.isInactive = true;
                           await event.save();
                       }
                   }
            
                   //update events to archive
                   const inactiveEvents = await EventModel.find({ isArchived: false, isInactive: true });
            
                   for (let event of inactiveEvents) {
                       const inactiveDuration = Math.floor((currentDate - new Date(event.end_date)) / (1000 * 60 * 60 * 24)); // Calculate the number of days since the event ended
            
                       // If the event has been inactive for 30 days, archive it
                       if (inactiveDuration >= 30) {
                           event.isArchived = true; // Mark the event as archived
                           await event.save(); // Save the updated event to the database
                       }
                   }
            
            
                   const searchName = req.query.search_name || '';
                   const searchRegex = new RegExp(searchName, 'i');
            
                   //pages
                   const page = parseInt(req.query.page) || 1;
                   const limit = 10;
                   const skip = (page - 1) * limit;
            
                   //get all cases with pagination
                   const events = await EventModel.find({
                       isArchived: false,
                       $or:[
                           {'header': searchRegex}
                       ]
                   })
                   .skip(skip)
                   .limit(limit)
                   .exec();
            
                   const totalCases = await EventModel.countDocuments({
                       isArchived: false,
                       $or:[
                           {'header': searchRegex}
                       ]
                   });
            
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
            
                   let totalPages = 0;
            
                   if(totalCases == 0){
                       totalPages = 1;
                   }else{
                       totalPages = Math.ceil(totalCases/limit);
                   }
               // const totalPages = Math.ceil(totalCases/limit);
                   
                   req.session.lastpage = '/admin-homepage';
            
                   console.log(page, totalPages);
            
                   resp.render('admin-event-db-view', {
                       layout: 'layout',
                       title: 'Admin Events DB', 
                       totalPages: totalPages,
                       currentPage: page,
                       events: allEvents
                   });
            
               } catch(error){
                   console.error('Error fetching all cases:', error);
                   resp.status(500).send('Internal Server Error');
               }   
    }); 

    //Admin view archived events db
    app.get('/admin-view-events-db-archived', isAuth, async function(req, resp){
        try{
                   const searchName = req.query.search_name || '';
                   const searchRegex = new RegExp(searchName, 'i');
            
                   //pages
                   const page = parseInt(req.query.page) || 1;
                   const limit = 10;
                   const skip = (page - 1) * limit;
            
                   //get all cases with pagination
                   const events = await EventModel.find({
                       isArchived: true,
                       $or:[
                           {'header': searchRegex}
                       ]
                   })
                   .skip(skip)
                   .limit(limit)
                   .exec();
            
                   const totalCases = await EventModel.countDocuments({
                       isArchived: true,
                       $or:[
                           {'header': searchRegex}
                       ]
                   });
            
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
            
                   let totalPages = 0;
            
                   if(totalCases == 0){
                       totalPages = 1;
                   }else{
                       totalPages = Math.ceil(totalCases/limit);
                   }
               // const totalPages = Math.ceil(totalCases/limit);
                   
                   req.session.lastpage = '/admin-homepage';
            
                   console.log(page, totalPages);
            
                   resp.render('admin-event-db-view-archived', {
                       layout: 'layout',
                       title: 'Admin Events DB', 
                       totalPages: totalPages,
                       currentPage: page,
                       events: allEvents
                   });
            
               } catch(error){
                   console.error('Error fetching all cases:', error);
                   resp.status(500).send('Internal Server Error');
               }   
    }); 

    //Admin create event
    app.get('/admin-create-event', isAuth, async function(req, resp){
        req.session.lastpage = '/admin-create-event';
        resp.render('admin-create-event', {
            layout: 'layout',
            title: 'Admins Create Event'
        });
    });

    //Admin submit event
    app.post('/admin-submit-event', isAuth, upload.single('event_pic'), async function(req, resp){
        try {
            const {headline, startDate, finishDate, details} = req.body;

            if(!headline|| !startDate || !finishDate || !details){
   
                //return resp.status(400).send("Missing required field");
                
                return resp.status(400).json({ message: 'All fields are required.'});

            }

            let picString = "";
            if (req.file) {
                picString = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            }

            // _id
            // Find all cases and convert _id to integers for sorting
            const allCases = await EventModel.find().exec();
            const caseIds = allCases.map(caseDoc => parseInt(caseDoc._id, 10)).filter(id => !isNaN(id));

            // Get the highest _id
            const latestIdNum = caseIds.length > 0 ? Math.max(...caseIds) : 0;
            const newReviewId = (latestIdNum + 1).toString();

            const newEvent = new EventModel({
                _id : newReviewId,
                pic: picString || "/images/brgy-parang-1.png",
                header: headline,
                start_date: startDate,
                end_date: finishDate,
                details: details,
                isArchived: false,
                isInactive: false
            });

            await newEvent.save();

            resp.redirect('/admin-view-events-db');
            //res.status(200).json({ redirectUrl: '/employee-events-db' });

        }catch(error){
            console.error(error);
            resp.status(500).send('Internal Server Error')
        }
    });

    //Admin view event
    app.get('/admin-view-event/:_id', async function(req, resp){
        const eventID = req.params._id;
        console.log(eventID);

        let isEditable = "";

        try{
            const eventDetails = await EventModel.findOne({ _id: eventID }).lean();
            if(eventDetails){
                console.log('found case');
                const headline = eventDetails.header;
                const pic = eventDetails.pic;
                const details = eventDetails.details;
                const startDate = eventDetails.start_date;
                const finishDate = eventDetails.end_date;

                if(eventDetails.isInactive || eventDetails.isArchived){
                    isEditable = "hidden";
                }

                req.session.lastpage = `/admin-view-event/${eventID}`;

                resp.render('admin-view-event', {
                    layout: 'layout',
                    title: 'Admin View Event',
                    isEditable: isEditable,
                    headline: headline,
                    pic: pic,
                    details: details,
                    startDate: startDate,
                    finishDate: finishDate,
                    eventID: eventID
                });

            }
            else{
                resp.status(404).send('Case not found');
            }

        }catch(error){
            console.error(error);
            resp.status(500).send('Internal Server Error')
        }
    });

    //Admin edit event
    app.get('/admin-edit-event/:_id', isAuth, async function(req, resp){
        const eventID = req.params._id;
        console.log(eventID);

        try{

            const isEditable = '';

            const eventDetails = await EventModel.findOne({ _id: eventID }).lean();
            if(eventDetails){
                console.log('found case');
                const headline = eventDetails.header;
                const pic = eventDetails.pic;
                const details = eventDetails.details;
                const startDate = eventDetails.start_date;
                const finishDate = eventDetails.end_date;

                if(eventDetails.isInactive || eventDetails.isArchived){
                   isEditable = "hidden";
                }

                req.session.lastpage = `/admin-edit-event/${eventID}`;

                resp.render('admin-edit-event', {
                    layout: 'layout',
                    title: 'Admin Edit Event',
                    isEditable: isEditable,
                    headline: headline,
                    pic: pic,
                    details: details,
                    startDate: startDate,
                    finishDate: finishDate,
                    eventID: eventID
                });

            }
            else{
                resp.status(404).send('Case not found');
            }

        }catch(error){
            console.error(error);
            resp.status(500).send('Internal Server Error')
        }


    });

    //admin submit edited event
    app.post('/admin-edit-event/submit-edit-event-admin', upload.single('event_pic'), async function(req, resp){
        console.log("Updating");

        try{

            const {eventID, headline_edit, startDate_edit, finishDate_edit, details_edit} = req.body;
            console.log("case to update: ");
            console.log(eventID);

            let picString = "";

            if(req.file){
                picString = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

            }else{
                const existingEvent = await EventModel.findById(eventID).exec();
                if (existingEvent) {
                    picString = existingEvent.pic; // Use the existing picture
                }

            }

            const updatedEvent = await EventModel.findOneAndUpdate(
                {_id : eventID},
                {
                    pic: picString,
                    header: headline_edit,
                    start_date: startDate_edit,
                    end_date: finishDate_edit,
                    details: details_edit,
                },
                { new: true }
            );

            if(updatedEvent){
                console.log('successfully updated')
                resp.redirect(`/admin-view-event/${eventID}`);
            }
            else{
                resp.status(404).send('Case not found');s
            }
            


        }catch(error){
            console.error(error);
            resp.status(500).send('Internal Server Error')
        }

    });

    //admin archive event 
    app.get('/admin-archive-event/:_id', async function(req, resp){
        const eventID = req.params._id;
        console.log(eventID);

        try {
            // Find the case by EntryNo and update it with new values
            const updatedEvent = await EventModel.findOneAndUpdate(
                { _id : eventID },
                {
                    isArchived: true
                },
                { new: true } // Return the updated document
            );

            if (updatedEvent) {
                resp.redirect(`/admin-view-events-db`);
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error updating case details:', error);
            resp.status(500).send('Internal Server Error');
        }


    });
 
    //admin view archived
    app.get('/admin-view-event-archive/:_id', async function(req, resp){
        const eventID = req.params._id;
        console.log(eventID);

        let isEditable = "";

        try{
            const eventDetails = await EventModel.findOne({ _id: eventID }).lean();
            if(eventDetails){
                console.log('found case');
                const headline = eventDetails.header;
                const pic = eventDetails.pic;
                const details = eventDetails.details;
                const startDate = eventDetails.start_date;
                const finishDate = eventDetails.end_date;

                if(eventDetails.isInactive || eventDetails.isArchived){
                    isEditable = "hidden";
                }

                req.session.lastpage = `/admine-view-event-archive/${eventID}`;

                resp.render('admin-view-archive-event', {
                    layout: 'layout',
                    title: 'Admin View Event',
                    isEditable: isEditable,
                    headline: headline,
                    pic: pic,
                    details: details,
                    startDate: startDate,
                    finishDate: finishDate,
                    eventID: eventID
                });

            }
            else{
                resp.status(404).send('Case not found');
            }

        }catch(error){
            console.error(error);
            resp.status(500).send('Internal Server Error')
        }
    });

    //admin restore
    app.get('/admin-restore-event/:_id', async function(req, resp){
        const eventID = req.params._id;

        try {
            // Find the case by EntryNo and update it with new values
            const updatedEvent = await EventModel.findOneAndUpdate(
                { _id : eventID },
                {
                    isArchived: false
                },
                { new: true } // Return the updated document
            );

            if (updatedEvent) {
                resp.redirect(`/admin-view-events-db`);
                //resp.redirect(`/lupon-view-case/${updatedCase._id}`); // Redirect to the homepage after successful update
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error updating case details:', error);
            resp.status(500).send('Internal Server Error');
        }

    });

    /************************************************************EMPLOYEE************************************************/
    

    //Employee-index
    app.get('/employee-index',async function(req, resp){
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

                resp.render('employee-index',{
                    layout: 'index-employee',
                    title: 'Employee Index',
                    cssFile1: 'index',
                    cssFile2: null,
                    javascriptFile1: null,
                    javascriptFile2: null,
                    events: allEvents,
                });
            
        }catch (error) {
            console.error('Error fetching events:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    //Employee-Homepage
    app.get('/employee-home', isAuth, function(req, resp){
        req.session.lastpage = '/employee-home';
        resp.render('employee-home', {
            layout: 'index-employee',
            title: 'Employee Homepage'
        });
    });

    //Employee events view
    app.get('/employee-events-db', isAuth, async function(req, resp){

        try{

             //update inactive events
            const currentDate = new Date();
            const eventsToUpdate = await EventModel.find({ isArchived: false, isInactive: false });

            for(let event of eventsToUpdate){
                const endDate = new Date(event.end_date);

                if(currentDate > endDate){
                    event.isInactive = true;
                    await event.save();
                }
            }

            //update events to archive
            const inactiveEvents = await EventModel.find({ isArchived: false, isInactive: true });

            for (let event of inactiveEvents) {
                const inactiveDuration = Math.floor((currentDate - new Date(event.end_date)) / (1000 * 60 * 60 * 24)); // Calculate the number of days since the event ended

                // If the event has been inactive for 30 days, archive it
                if (inactiveDuration >= 30) {
                    event.isArchived = true; // Mark the event as archived
                    await event.save(); // Save the updated event to the database
                }
            }


            const searchName = req.query.search_name || '';
            const searchRegex = new RegExp(searchName, 'i');

            //pages
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            //get all cases with pagination
            const events = await EventModel.find({
                isArchived: false,
                $or:[
                    {'header': searchRegex}
                ]
            })
            .skip(skip)
            .limit(limit)
            .exec();

            const totalCases = await EventModel.countDocuments({
                isArchived: false,
                $or:[
                    {'header': searchRegex}
                ]
            });

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

            let totalPages = 0;

            if(totalCases == 0){
                totalPages = 1;
            }else{
                totalPages = Math.ceil(totalCases/limit);
            }
        // const totalPages = Math.ceil(totalCases/limit);
            
            req.session.lastpage = '/employee-events-db';

            console.log(page, totalPages);

            resp.render('employee-event-db-view', {
                layout: 'index-employee',
                title: 'Employee Events DB', 
                totalPages: totalPages,
                currentPage: page,
                events: allEvents
            });

        } catch(error){
            console.error('Error fetching all cases:', error);
            resp.status(500).send('Internal Server Error');
        }   
    });

    app.get('/employee-events-archived', isAuth, async function(req, resp){
        try{
            const searchName = req.query.search_name || '';
            const searchRegex = new RegExp(searchName, 'i');

            //pages
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            //get all cases with pagination
            const events = await EventModel.find({
                isArchived: true,
                $or:[
                    {'header': searchRegex}
                ]
            })
            .skip(skip)
            .limit(limit)
            .exec();

            const totalCases = await EventModel.countDocuments({
                isArchived: true,
                $or:[
                    {'header': searchRegex}
                ]
            });

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

            let totalPages = 0;

            if(totalCases == 0){
                totalPages = 1;
            }else{
                totalPages = Math.ceil(totalCases/limit);
            }
        // const totalPages = Math.ceil(totalCases/limit);
            
            req.session.lastpage = '/employee-events-db-archived';

            resp.render('employee-event-db-view-archived', {
                layout: 'index-employee',
                title: 'Employee Events DB', 
                totalPages: totalPages,
                currentPage: page,
                events: allEvents
            });

        } catch(error){
            console.error('Error fetching all cases:', error);
            resp.status(500).send('Internal Server Error');
        }   
    });

    //Employee create
    app.get('/employee-create-event', isAuth, function(req, resp){
        req.session.lastpage = '/employee-create-event';
        resp.render('employee-create-event', {
            layout: 'index-employee',
            title: 'Employee Create Event'
        });
    });

    //Employee submit create
    app.post('/employee-submit-event', isAuth, upload.single('event_pic'), async function(req, resp){
        try {
            const {headline, startDate, finishDate, details} = req.body;

            if(!headline|| !startDate || !finishDate || !details){
   
                //return resp.status(400).send("Missing required field");
                
                return resp.status(400).json({ message: 'All fields are required.'});

            }

            let picString = "";
            if (req.file) {
                picString = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            }

            // _id
            // Find all cases and convert _id to integers for sorting
            const allCases = await EventModel.find().exec();
            const caseIds = allCases.map(caseDoc => parseInt(caseDoc._id, 10)).filter(id => !isNaN(id));

            // Get the highest _id
            const latestIdNum = caseIds.length > 0 ? Math.max(...caseIds) : 0;
            const newReviewId = (latestIdNum + 1).toString();

            const newEvent = new EventModel({
                _id : newReviewId,
                pic: picString || "/images/brgy-parang-1.png",
                header: headline,
                start_date: startDate,
                end_date: finishDate,
                details: details,
                isArchived: false,
                isInactive: false
            });

            await newEvent.save();

            resp.redirect('/employee-events-db');
            //res.status(200).json({ redirectUrl: '/employee-events-db' });

        }catch(error){
            console.error(error);
            resp.status(500).send('Internal Server Error')
        }
    });

    //Employee view event
    app.get('/employee-view-event/:_id', async function(req, resp){
        const eventID = req.params._id;
        console.log(eventID);

        let isEditable = "";

        try{
            const eventDetails = await EventModel.findOne({ _id: eventID }).lean();
            if(eventDetails){
                console.log('found case');
                const headline = eventDetails.header;
                const pic = eventDetails.pic;
                const details = eventDetails.details;
                const startDate = eventDetails.start_date;
                const finishDate = eventDetails.end_date;

                if(eventDetails.isInactive || eventDetails.isArchived){
                    isEditable = "hidden";
                }

                req.session.lastpage = `/employee-view-event/${eventID}`;

                resp.render('employee-view-event', {
                    layout: 'index-employee',
                    title: 'Employee View Event',
                    isEditable: isEditable,
                    headline: headline,
                    pic: pic,
                    details: details,
                    startDate: startDate,
                    finishDate: finishDate,
                    eventID: eventID
                });

            }
            else{
                resp.status(404).send('Case not found');
            }

        }catch(error){
            console.error(error);
            resp.status(500).send('Internal Server Error')
        }
    });

    //view archived
    app.get('/employee-view-archive/:_id', async function(req, resp){
        const eventID = req.params._id;
        console.log(eventID);

        let isEditable = "";

        try{
            const eventDetails = await EventModel.findOne({ _id: eventID }).lean();
            if(eventDetails){
                console.log('found case');
                const headline = eventDetails.header;
                const pic = eventDetails.pic;
                const details = eventDetails.details;
                const startDate = eventDetails.start_date;
                const finishDate = eventDetails.end_date;

                if(eventDetails.isInactive || eventDetails.isArchived){
                    isEditable = "hidden";
                }

                req.session.lastpage = `/employee-view-archive/${eventID}`;

                resp.render('employee-view-archive-event', {
                    layout: 'index-employee',
                    title: 'Employee View Event',
                    isEditable: isEditable,
                    headline: headline,
                    pic: pic,
                    details: details,
                    startDate: startDate,
                    finishDate: finishDate,
                    eventID: eventID
                });

            }
            else{
                resp.status(404).send('Case not found');
            }

        }catch(error){
            console.error(error);
            resp.status(500).send('Internal Server Error')
        }
    });

    //Empployee edit
    app.get('/employee-edit-event/:_id', isAuth, async function(req, resp){
        const eventID = req.params._id;
        console.log(eventID);

        try{

            const isEditable = '';

            const eventDetails = await EventModel.findOne({ _id: eventID }).lean();
            if(eventDetails){
                console.log('found case');
                const headline = eventDetails.header;
                const pic = eventDetails.pic;
                const details = eventDetails.details;
                const startDate = eventDetails.start_date;
                const finishDate = eventDetails.end_date;

                if(eventDetails.isInactive || eventDetails.isArchived){
                   isEditable = "hidden";
                }

                req.session.lastpage = `/employee-edit-event/${eventID}`;

                resp.render('employee-edit-event', {
                    layout: 'index-employee',
                    title: 'Employee Edit Event',
                    isEditable: isEditable,
                    headline: headline,
                    pic: pic,
                    details: details,
                    startDate: startDate,
                    finishDate: finishDate,
                    eventID: eventID
                });

            }
            else{
                resp.status(404).send('Case not found');
            }

        }catch(error){
            console.error(error);
            resp.status(500).send('Internal Server Error')
        }


    });

    //employee submit edited case 
    app.post('/employee-edit-event/submit-edit-event', upload.single('event_pic'), async function(req, resp){
        console.log("Updating");

        try{

            const {eventID, headline_edit, startDate_edit, finishDate_edit, details_edit} = req.body;
            console.log("case to update: ");
            console.log(eventID);

            let picString = "";

            if(req.file){
                picString = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

            }else{
                const existingEvent = await EventModel.findById(eventID).exec();
                if (existingEvent) {
                    picString = existingEvent.pic; // Use the existing picture
                }

            }

            const updatedEvent = await EventModel.findOneAndUpdate(
                {_id : eventID},
                {
                    pic: picString,
                    header: headline_edit,
                    start_date: startDate_edit,
                    end_date: finishDate_edit,
                    details: details_edit,
                },
                { new: true }
            );

            if(updatedEvent){
                console.log('successfully updated')
                resp.redirect(`/employee-view-event/${eventID}`);
            }
            else{
                resp.status(404).send('Case not found');s
            }
            


        }catch(error){
            console.error(error);
            resp.status(500).send('Internal Server Error')
        }

    });

    //Employee archive event 
    app.get('/employee-archive-event/:_id', async function(req, resp){
        const eventID = req.params._id;
        console.log(eventID);

        try {
            // Find the case by EntryNo and update it with new values
            const updatedEvent = await EventModel.findOneAndUpdate(
                { _id : eventID },
                {
                    isArchived: true
                },
                { new: true } // Return the updated document
            );

            if (updatedEvent) {
                resp.redirect(`/employee-events-db`);
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error updating case details:', error);
            resp.status(500).send('Internal Server Error');
        }


    });

    app.get('/employee-restore-event/:_id', async function(req, resp){
        const eventID = req.params._id;

        try {
            // Find the case by EntryNo and update it with new values
            const updatedEvent = await EventModel.findOneAndUpdate(
                { _id : eventID },
                {
                    isArchived: false
                },
                { new: true } // Return the updated document
            );

            if (updatedEvent) {
                resp.redirect(`/employee-events-db`);
                //resp.redirect(`/lupon-view-case/${updatedCase._id}`); // Redirect to the homepage after successful update
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error updating case details:', error);
            resp.status(500).send('Internal Server Error');
        }

    });


    /************************************************************TANOD************************************************/

    //Tanod Index
    app.get('/tanod-index',async function(req, resp){
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

                resp.render('tanod-index',{
                    layout: 'index-tanod',
                    title: 'Tanod Index',
                    cssFile1: 'index',
                    cssFile2: null,
                    javascriptFile1: null,
                    javascriptFile2: null,
                    events: allEvents,
                });
            
        }catch (error) {
            console.error('Error fetching events:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    //Tanod Homepage
    app.get('/tanod-home', isAuth, async function(req, resp){
        try{
            const searchName = req.query.search_name || '';
            const searchRegex = new RegExp(searchName, 'i');

            //pages
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            //new code
            //for sorting
            const sortField = req.query.sort_field || 'EntryNo';
            const sortOrder = req.query.sort_order === 'asc' ? 1 : -1;
            const sortOptions = {};
            sortOptions[sortField] = sortOrder;

            //get all cases with pagination
            const cases = await TanodCaseModel.find({
                isArchived : false, 
                $or:[
                    {'ReporteeInfo.FirstName': searchRegex},
                    {'ReporteeInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            })
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .exec();

            const totalCases = await TanodCaseModel.countDocuments({
                isArchived : false, 
                $or:[
                    {'ReporteeInfo.FirstName': searchRegex},
                    {'ReporteeInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            });

            let allCases = [];
            for(const item of cases){
                let stat_lc = 'resolved';
                let isEditable = 'hidden';
                if(item.Status == 'Ongoing'){
                    stat_lc = 'ongoing';
                    isEditable = '';
                }

                allCases.push({
                    caseID : item._id,
                    entryNo: item.EntryNo,
                    date: item.Date,
                    reporteeFirstName: item.ReporteeInfo.FirstName,
                    reporteeLastName: item.ReporteeInfo.LastName,
                    respondentFirstName: item.RespondentInfo.FirstName,
                    respondentLastName: item.RespondentInfo.LastName,
                    status: item.Status,
                    stat_lc: stat_lc,
                    isEditable: isEditable
                });
            }

            let totalPages = 0;

            if(totalCases == 0){
                totalPages = 1;
            }else{
                totalPages = Math.ceil(totalCases/limit);
            }
           // const totalPages = Math.ceil(totalCases/limit);
            
            req.session.lastpage = '/tanod-home';
            resp.render('tanod-home', {
                layout: 'index-tanod',
                title: 'Tanod Homepage',
                cases: allCases,
                currentPage: page,
                totalPages: totalPages,
                sortField: sortField,
                sortOrder: req.query.sort_order || 'desc' //make it default descending
            });

        } catch(error){
            console.error('Error fetching all cases:', error);
            resp.status(500).send('Internal Server Error');
        }   
    });


    //tanod homepage to view archived
    app.get('/tanod-home-archived', isAuth, async function(req, resp){
        try{
            const searchName = req.query.search_name || '';
            const searchRegex = new RegExp(searchName, 'i');

            //pages
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            //new code
            //for sorting
            const sortField = req.query.sort_field || 'EntryNo';
            const sortOrder = req.query.sort_order === 'asc' ? 1 : -1;
            const sortOptions = {};
            sortOptions[sortField] = sortOrder;

            //get all cases with pagination
            const cases = await TanodCaseModel.find({
                isArchived : true, 
                $or:[
                    {'ReporteeInfo.FirstName': searchRegex},
                    {'ReporteeInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            })
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .exec();

            const totalCases = await TanodCaseModel.countDocuments({
                isArchived : true, 
                $or:[
                    {'ReporteeInfo.FirstName': searchRegex},
                    {'ReporteeInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            });

            let allCases = [];
            for(const item of cases){
                let stat_lc = 'resolved';
                let isEditable = 'hidden';
                if(item.Status == 'Ongoing'){
                    stat_lc = 'ongoing';
                    isEditable = '';
                }

                allCases.push({
                    caseID : item._id,
                    entryNo: item.EntryNo,
                    date: item.Date,
                    reporteeFirstName: item.ReporteeInfo.FirstName,
                    reporteeLastName: item.ReporteeInfo.LastName,
                    respondentFirstName: item.RespondentInfo.FirstName,
                    respondentLastName: item.RespondentInfo.LastName,
                    status: item.Status,
                    stat_lc: stat_lc,
                    isEditable: isEditable
                });
            }

            let totalPages = 0;

            if(totalCases == 0){
                totalPages = 1;
            }else{
                totalPages = Math.ceil(totalCases/limit);
            }
           // const totalPages = Math.ceil(totalCases/limit);
            
            req.session.lastpage = '/tanod-home-archived';
            resp.render('tanod-home-archived', {
                layout: 'index-tanod',
                title: 'Tanod Homepage',
                cases: allCases,
                currentPage: page,
                totalPages: totalPages,
                sortField: sortField,
                sortOrder: req.query.sort_order || 'desc' //make it default descending
            });

        } catch(error){
            console.error('Error fetching all cases:', error);
            resp.status(500).send('Internal Server Error');
        }   
    });


    //to view tanod cases that are archived 
    /** app.get('/tanod-home-archived', isAuth, async function(req, resp){
        try{
            const searchName = req.query.search_name || '';
            const searchRegex = new RegExp(searchName, 'i');

            //pages
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            //new code
            //for sorting
            const sortField = req.query.sort_field || 'EntryNo';
            const sortOrder = req.query.sort_order === 'asc' ? 1 : -1;
            const sortOptions = {};
            sortOptions[sortField] = sortOrder;

            //get all cases with pagination
            const cases = await TanodCaseModel.find({
                isArchived : true, 
                $or:[
                    {'ReporteeInfo.FirstName': searchRegex},
                    {'ReporteeInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            })
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .exec();

            const totalCases = await TanodCaseModel.countDocuments({
                isArchived : true, 
                $or:[
                    {'ReporteeInfo.FirstName': searchRegex},
                    {'ReporteeInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            });

            let allCases = [];
            for(const item of cases){
                let stat_lc = 'resolved';
                let isEditable = 'hidden';
                if(item.Status == 'Ongoing'){
                    stat_lc = 'ongoing';
                    isEditable = '';
                }

                allCases.push({
                    caseID : item._id,
                    entryNo: item.EntryNo,
                    date: item.Date,
                    reporteeFirstName: item.ReporteeInfo.FirstName,
                    reporteeLastName: item.ReporteeInfo.LastName,
                    respondentFirstName: item.RespondentInfo.FirstName,
                    respondentLastName: item.RespondentInfo.LastName,
                    status: item.Status,
                    stat_lc: stat_lc,
                    isEditable: isEditable
                });
            }

            let totalPages = 0;

            if(totalCases == 0){
                totalPages = 1;
            }else{
                totalPages = Math.ceil(totalCases/limit);
            }
           // const totalPages = Math.ceil(totalCases/limit);
            
            req.session.lastpage = '/tanod-home';
            resp.render('tanod-home', {
                layout: 'index-tanod',
                title: 'Tanod Homepage',
                cases: allCases,
                currentPage: page,
                totalPages: totalPages,
                sortField: sortField,
                sortOrder: req.query.sort_order || 'desc' //make it default descending
            });

        } catch(error){
            console.error('Error fetching all cases:', error);
            resp.status(500).send('Internal Server Error');
        }   
    }); */

    //Tanod-Create-Case
    app.get('/tanod-create', function(req, resp){
        req.session.lastpage = '/tanod-create';
        resp.render('tanod-create-case', {
            layout: 'index-create',
            title: 'Tanod Create Case',
            message: ''
        });
    });

    //Save case tp DB
    app.post('/tanod-submit-case', async function(req, resp){

        const {
            entryNumber,
            date,
            status,
            reporteeFirstName,
            reporteeMiddleInitial,
            reporteeLastName,
            reporteeAddress,
            natureOfBlotter,
            respondentFirstName,
            respondentMiddleInitial,
            respondentLastName,
            deskOfficerFirstName,
            deskOfficerMiddleInitial,
            deskOfficerLastName,
            witnessFirstName,
            witnessMiddleInitial,
            witnessLastName,
            location
        } = req.body;

        if (!entryNumber || !date || !status || !reporteeFirstName || !reporteeLastName || !natureOfBlotter || !respondentFirstName || !respondentLastName || !deskOfficerFirstName || !witnessFirstName || !location 
            || !reporteeMiddleInitial || !reporteeAddress || ! respondentMiddleInitial || !deskOfficerMiddleInitial || !deskOfficerLastName || !witnessMiddleInitial || !witnessLastName)
             {
            return resp.status(400).json({ message: 'All fields are required.' });
        }

        const entryNumberint = Number(req.body.entryNumber);

        // _id
        // Find all cases and convert _id to integers for sorting
        const allCases = await TanodCaseModel.find().exec();
        const caseIds = allCases.map(caseDoc => parseInt(caseDoc._id, 10)).filter(id => !isNaN(id));

        // Get the highest _id
        const latestIdNum = caseIds.length > 0 ? Math.max(...caseIds) : 0;
        const newReviewId = (latestIdNum + 1).toString();

        const caseData = {
            _id: newReviewId,
            EntryNo: entryNumberint,
            Date: req.body.date,
            Status: req.body.status,
            ReporteeInfo:{
                FirstName: req.body.reporteeFirstName,
                MiddleInitial: req.body.reporteeMiddleInitial,
                LastName: req.body.reporteeLastName,
                Address: req.body.reporteeAddress
            },
            natureOfBlotter: req.body.natureOfBlotter,
            RespondentInfo: {
                FirstName: req.body.respondentFirstName,
                MiddleInitial: req.body.respondentMiddleInitial,
                LastName: req.body.respondentLastName,
            },
            DeskOfficerInfo: {
                FirstName: req.body.deskOfficerFirstName,
                MiddleInitial: req.body.deskOfficerMiddleInitial,
                LastName: req.body.deskOfficerLastName,
            },
            WitnessInfo: {
                FirstName: req.body.witnessFirstName,
                MiddleInitial: req.body.witnessMiddleInitial,
                LastName: req.body.witnessLastName,
            },
            Location: req.body.location,
            isArchived: false
        }

        //put all details in the db
        try{

            const existingCase = await TanodCaseModel.findOne({ EntryNo: entryNumber}).lean();

            if(existingCase){
                console.log("Entry Number already exists");
                return resp.status(400).json({message: 'Entry Number is Already Taken'});
            }
            const newCase = new TanodCaseModel(caseData);
            await newCase.save();
            console.log('Case Succesfully saved');
            console.log(entryNumber);
            resp.status(200).json({ message: 'Case successfully saved', redirectUrl: `/page-view-case/${entryNumber}` });
            //resp.redirect(`/page-view-case/${entryNumber}`);

        } catch (error){
            console.error('Error saving the case:', error);
            resp.redirect('/tanod-create');
        }
    });

    //View tanod case
    app.get('/page-view-case/:entryNumber', async function(req, resp){
        const entryNumber = Number(req.params.entryNumber);
        console.log(entryNumber);
        let resolveStat = 'selected';
        let ongoingStat = 'disabled';
        let isEditable = "hidden";

        try {
            const caseDetails = await TanodCaseModel.findOne({ EntryNo: entryNumber }).lean();
            if (caseDetails) {
                console.log('found case');
                const reporteeInfo = caseDetails.ReporteeInfo;
                const respondentInfo = caseDetails.RespondentInfo;
                const deskInfo = caseDetails.DeskOfficerInfo;
                const witnessInfo = caseDetails.WitnessInfo;


                if(caseDetails.Status == 'Ongoing'){
                    resolveStat = 'disabled';
                    ongoingStat = 'selected';
                    isEditable = '';
                }

                req.session.lastpage = `/page-view-case/${entryNumber}`;
                resp.render('tanod-view-case', {
                    layout: 'index-view-tl', 
                    title: 'View Tanod Case',
                    case: caseDetails,
                    resolveStat: resolveStat,
                    ongoingStat: ongoingStat,
                    reporteeInfo: reporteeInfo,
                    respondentInfo: respondentInfo,
                    deskInfo: deskInfo,
                    witnessInfo: witnessInfo,
                    isEditable : isEditable
                });
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    //view archived tanod case
    app.get('/tanod-view-archived/:id', async function(req, resp){
        const id = Number(req.params.id);
        console.log(id);
        let resolveStat = 'selected';
        let ongoingStat = 'disabled';
        let isEditable = "hidden";

        try {
            const caseDetails = await TanodCaseModel.findOne({ _id: id }).lean();
            if (caseDetails) {
                console.log('found case');
                const reporteeInfo = caseDetails.ReporteeInfo;
                const respondentInfo = caseDetails.RespondentInfo;
                const deskInfo = caseDetails.DeskOfficerInfo;
                const witnessInfo = caseDetails.WitnessInfo;


                if(caseDetails.Status == 'Ongoing'){
                    resolveStat = 'disabled';
                    ongoingStat = 'selected';
                    isEditable = '';
                }

                req.session.lastpage = `/tanod-view-archived/${id}`;
                resp.render('tanod-view-archived', {
                    layout: 'index-view-tl', 
                    title: 'View Tanod Case',
                    case: caseDetails,
                    resolveStat: resolveStat,
                    ongoingStat: ongoingStat,
                    reporteeInfo: reporteeInfo,
                    respondentInfo: respondentInfo,
                    deskInfo: deskInfo,
                    witnessInfo: witnessInfo,
                    isEditable : isEditable
                });
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    //Tanod Edit Case
    app.get('/tanod-edit-case/:entryNumber', async function(req, resp){
        const entryNumber = Number(req.params.entryNumber);
        console.log(entryNumber);
        let resolveStat = 'selected';
        let ongoingStat = '';
        try {
            const caseDetails = await TanodCaseModel.findOne({ EntryNo: entryNumber }).lean();
            if (caseDetails) {
                console.log('found case');
                const reporteeInfo = caseDetails.ReporteeInfo;
                const respondentInfo = caseDetails.RespondentInfo;
                const deskInfo = caseDetails.DeskOfficerInfo;
                const witnessInfo = caseDetails.WitnessInfo;

                if(caseDetails.Status == 'Ongoing'){
                    resolveStat = '';
                    ongoingStat = 'selected';
                }
            
                // console.log(href)
                req.session.lastpage = `/tanod-edit-case/${entryNumber}`;
                resp.render('tanod-edit-case', {
                    layout: 'index-edit', 
                    title: 'View Tanod Case',
                    case: caseDetails,
                    reporteeInfo: reporteeInfo,
                    respondentInfo: respondentInfo,
                    deskInfo: deskInfo,
                    witnessInfo: witnessInfo,
                    resolveStat: resolveStat,
                    ongoingStat: ongoingStat
                });
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    //Save Edit details
    app.post('/update-tanod-case', async function(req, resp){
        const {
            date,
            status,
            reporteeFirstName,
            reporteeMiddleInitial,
            reporteeLastName,
            reporteeAddress,
            natureOfBlotter,
            respondentFirstName,
            respondentMiddleInitial,
            respondentLastName,
            deskOfficerFirstName,
            deskOfficerMiddleInitial,
            deskOfficerLastName,
            witnessFirstName,
            witnessMiddleInitial,
            witnessLastName,
            location
        } = req.body;

        if (!date || !status || !reporteeFirstName || !reporteeLastName || !natureOfBlotter || !respondentFirstName || !respondentLastName || !deskOfficerFirstName || !witnessFirstName || !location 
            || !reporteeMiddleInitial || !reporteeAddress || ! respondentMiddleInitial || !deskOfficerMiddleInitial || !deskOfficerLastName || !witnessMiddleInitial || !witnessLastName)
             {
            return resp.status(400).json({ message: 'All fields are required.' });
        }

        const entryNumberint = Number(req.body.entryNumber);
        //code to edit the case here
        try {
            // Find the case by EntryNo and update it with new values
            const updatedCase = await TanodCaseModel.findOneAndUpdate(
                { EntryNo: entryNumberint },
                {
                    Date: req.body.date,
                    Status: req.body.status,
                    ReporteeInfo: {
                        LastName: req.body.reporteeLastName,
                        MiddleInitial: req.body.reporteeMiddleInitial,
                        FirstName: req.body.reporteeFirstName,
                        Address: req.body.reporteeAddress
                    },
                    natureOfBlotter: req.body.natureOfBlotter,
                    RespondentInfo: {
                        LastName: req.body.respondentLastName,
                        MiddleInitial: req.body.respondentMiddleInitial,
                        FirstName: req.body.respondentFirstName
                    },
                    DeskOfficerInfo: {
                        LastName: req.body.deskOfficerLastName,
                        MiddleInitial: req.body.deskOfficerMiddleInitial,
                        FirstName: req.body.deskOfficerFirstName
                    },
                    WitnessInfo: {
                        LastName: req.body.witnessLastName,
                        MiddleInitial: req.body.witnessMiddleInitial,
                        FirstName: req.body.witnessFirstName
                    },
                    Location: req.body.location
                },
                { new: true } // Return the updated document
            );

            if (updatedCase) {
                resp.status(200).json({ message: 'Case successfully updated', redirectUrl: `/page-view-case/${entryNumberint}` });
                //resp.redirect(`/page-view-case/${entryNumberint}`); // Redirect to the homepage after successful update
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error updating case details:', error);
            resp.status(500).send('Internal Server Error');
        }
    });


    //Tanod delete
    app.get('/tanod-delete-case/:entryNumber', async function(req, resp){
        const entryNumber = Number(req.params.entryNumber);
        try{
            //delete code
            const deletedCase = await TanodCaseModel.findOneAndDelete({EntryNo: entryNumber});

            if(deletedCase){
                resp.redirect('/tanod-home');
            }else{
                resp.status(404).send('Case not found');
            }
        }catch(error){
            console.error('Error deleting the case:', error);
            // Respond with a 500 status in case of an error
            resp.status(500).send('An error occurred while deleting the case');
        }
    });

    //Tanod Mark Resolve
    app.get('/tanod-mark-resolve/:entryNumber', async function(req, resp){
        const entryNumber = Number(req.params.entryNumber);
        try{
            const markResolve = await TanodCaseModel.findOneAndUpdate({EntryNo: entryNumber}, {Status: "Resolved"}, {new: true});
            if (markResolve){
                resp.redirect('/tanod-home');
            }
            else{
                resp.status(404).send('Case not found');

            }
        } catch (error){
            console.error('Error resolving case details:', error);
            resp.redirect('/tanod-home');
        }
    });

    app.post('/tanod-delete-cases', async function(req, resp) {
        const { caseIds } = req.body;
        try {
            await TanodCaseModel.deleteMany({ _id: { $in: caseIds } });
            resp.json({ success: true });
        } catch (error) {
            console.error('Error deleting Tanod cases:', error);
            resp.json({ success: false });
        }
    });

    app.post('/tanod-resolve-cases', async function(req, resp) {
        const { caseIds } = req.body;
        try {
            await TanodCaseModel.updateMany({ _id: { $in: caseIds } }, { $set: { Status: 'Resolved' }});
            resp.json({ success: true });
        } catch (error) {
            console.error('Error resolving Tanod cases:', error);
            resp.json({ success: false });
        }
    });

    app.post('/tanod-resolve-onClick', async function(req, resp){
        try{
            const caseId = req.body.caseId;
            if(!caseId){
                return resp.status(400).json({ success: false, message: 'Case ID is required'});

            }

            await TanodCaseModel.findByIdAndUpdate(caseId, {Status: 'Resolved'});

            resp.json({ success: true});
         }catch (error){
            console.error('Error updating case status:', error);
            resp.status(500).json({ success: false, message: 'Internal Server Error' });
         }
    });

    //new archive function - tanod 
    app.get('/archive-tanod-case/:_id', async function(req, resp){
        const caseID = req.params._id;

        try {
            // Find the case by EntryNo and update it with new values
            const updatedCase = await TanodCaseModel.findOneAndUpdate(
                { _id : caseID },
                {
                    isArchived: true
                },
                { new: true } // Return the updated document
            );

            if (updatedCase) {
                resp.redirect(`/tanod-home`);
                //resp.redirect(`/lupon-view-case/${updatedCase._id}`); // Redirect to the homepage after successful update
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error updating case details:', error);
            resp.status(500).send('Internal Server Error');
        }

    });

    //restore record -tanod
    app.get('/restore-tanod-case/:_id', async function(req, resp){
        const caseID = req.params._id;

        try {
            // Find the case by EntryNo and update it with new values
            const updatedCase = await TanodCaseModel.findOneAndUpdate(
                { _id : caseID },
                {
                    isArchived: false
                },
                { new: true } // Return the updated document
            );

            if (updatedCase) {
                resp.redirect(`/tanod-home`);
                //resp.redirect(`/lupon-view-case/${updatedCase._id}`); // Redirect to the homepage after successful update
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error updating case details:', error);
            resp.status(500).send('Internal Server Error');
        }

    });

    /************************************************************LUPON************************************************/

    //Lupon Index
    app.get('/lupon-index',async function(req, resp){
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

                resp.render('lupon-index',{
                    layout: 'index-lupon',
                    title: 'Lupon Index',
                    cssFile1: 'index',
                    cssFile2: null,
                    javascriptFile1: null,
                    javascriptFile2: null,
                    events: allEvents,
                });
            
        }catch (error) {
            console.error('Error fetching events:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    //Lupon Homepage
    app.get('/lupon-home', isAuth, async function(req, resp){
        try{
            const searchName = req.query.search_name || '';
            const searchRegex = new RegExp(searchName, 'i');

            //pages
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            //get all cases with pagination
            const cases = await LuponCaseModel.find({
                isArchived : false, 
                $or:[
                    {'ComplainerInfo.FirstName': searchRegex},
                    {'ComplainerInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            })
            .skip(skip)
            .limit(limit)
            .exec();

            const totalCases = await LuponCaseModel.countDocuments({
                isArchived : false, 
                $or:[
                    {'ComplainerInfo.FirstName': searchRegex},
                    {'ComplainerInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            });


            let allCases = [];
            for(const item of cases){
                let stat_lc = 'resolved';
                let isEditable = 'hidden';
                if(item.Status == 'Ongoing'){
                    stat_lc = 'ongoing';
                    isEditable ='';
                }
                

                allCases.push({
                    caseID: item._id,
                        caseTitle: item.CaseTitle,
                        caseType: item.CaseType,
                        complainerFirstName: item.ComplainerInfo.FirstName,
                        complainerLastName: item.ComplainerInfo.LastName,
                        respondentFirstName: item.RespondentInfo.FirstName,
                        respondentLastName: item.RespondentInfo.LastName,
                        status: item.Status,
                        stat_lc: stat_lc,
                        isEditable: isEditable
                });
            }

            let totalPages = 0;

            if(totalCases == 0){
                totalPages = 1;
            }else{
                totalPages = Math.ceil(totalCases/limit);
            }
            //const totalPages = Math.ceil(totalCases/limit);

            req.session.lastpage = 'lupon-home';
            resp.render('lupon-home', {
                layout: 'index-lupon',
                title: 'Lupon Homepage',
                cases: allCases,
                currentPage: page,
                totalPages: totalPages
            });

        } catch(error){
            console.error('Error fetching all cases:', error);
            resp.status(500).send('Internal Server Error');
        }   
    });

    app.get('/lupon-home-archived', isAuth, async function(req, resp){
        try{
            const searchName = req.query.search_name || '';
            const searchRegex = new RegExp(searchName, 'i');

            //pages
            const page = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;

            //get all cases with pagination
            const cases = await LuponCaseModel.find({
                isArchived : true, 
                $or:[
                    {'ComplainerInfo.FirstName': searchRegex},
                    {'ComplainerInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            })
            .skip(skip)
            .limit(limit)
            .exec();

            const totalCases = await LuponCaseModel.countDocuments({
                isArchived : true, 
                $or:[
                    {'ComplainerInfo.FirstName': searchRegex},
                    {'ComplainerInfo.LastName': searchRegex},
                    {'RespondentInfo.FirstName' : searchRegex},
                    {'RespondentInfo.LastName': searchRegex}
                ]
            });


            let allCases = [];
            for(const item of cases){
                let stat_lc = 'resolved';
                let isEditable = 'hidden';
                if(item.Status == 'Ongoing'){
                    stat_lc = 'ongoing';
                    isEditable ='';
                }
                

                allCases.push({
                    caseID: item._id,
                        caseTitle: item.CaseTitle,
                        caseType: item.CaseType,
                        complainerFirstName: item.ComplainerInfo.FirstName,
                        complainerLastName: item.ComplainerInfo.LastName,
                        respondentFirstName: item.RespondentInfo.FirstName,
                        respondentLastName: item.RespondentInfo.LastName,
                        status: item.Status,
                        stat_lc: stat_lc,
                        isEditable: isEditable
                });
            }

            let totalPages = 0;

            if(totalCases == 0){
                totalPages = 1;
            }else{
                totalPages = Math.ceil(totalCases/limit);
            }
            //const totalPages = Math.ceil(totalCases/limit);

            req.session.lastpage = 'lupon-home';
            resp.render('lupon-home-archived', {
                layout: 'index-lupon',
                title: 'Lupon Homepage',
                cases: allCases,
                currentPage: page,
                totalPages: totalPages
            });

        } catch(error){
            console.error('Error fetching all cases:', error);
            resp.status(500).send('Internal Server Error');
        }   
    });


    //Lupon create case
    app.get('/lupon-create', function(req, resp){
        req.session.lastpage = '/lupon-create';
        resp.render('lupon-create-case',{
            layout: 'index-create',
            title: 'Lupon Create Case'
        });
    });

    //Lupon Submit case
    app.post('/lupon-submit-case', async function(req, resp){
        const{
            caseTitle,
            caseType,
            status,
            respondentFirstName,
            respondentMiddleInitial,
            respondentLastName,
            complainerFirstName,
            complainerMiddleInitial,
            complainerLastName,
            mediationFirstName,
            mediationMiddleInitial,
            mediationLastName,
            conciliationFirstName,
            conciliationMiddleInitial,
            conciliationLastName,
            Case,
        } = req.body;

        if (!caseTitle || !caseType || !status || !complainerFirstName || !complainerMiddleInitial || !complainerLastName || !mediationFirstName || !mediationMiddleInitial || !mediationLastName || !respondentFirstName || !respondentLastName 
            || !conciliationFirstName || !conciliationMiddleInitial || ! respondentMiddleInitial || !conciliationLastName || !Case)
             {
            return resp.status(400).json({ message: 'All fields are required.' });
        }

        // _id
        // Find all cases and convert _id to integers for sorting
        const allCases = await LuponCaseModel.find().exec();
        const caseIds = allCases.map(caseDoc => parseInt(caseDoc._id, 10)).filter(id => !isNaN(id));

        // Get the highest _id
        const latestIdNum = caseIds.length > 0 ? Math.max(...caseIds) : 0;
        const newReviewId = (latestIdNum + 1).toString();

        const caseData= {
            _id: newReviewId,
            CaseTitle: req.body.caseTitle,
            CaseType: req.body.caseType,
            Status: req.body.status,
            RespondentInfo: {
                FirstName: req.body.respondentFirstName,
                MiddleInitial: req.body.respondentMiddleInitial,
                LastName: req.body.respondentLastName 
            },
            ComplainerInfo: {
                FirstName: req.body.complainerFirstName,
                MiddleInitial: req.body.complainerMiddleInitial,
                LastName: req.body.complainerLastName
            },
            MediationInfo: {
                FirstName: req.body.mediationFirstName,
                MiddleInitial: req.body.mediationMiddleInitial,
                LastName: req.body.mediationLastName
            },
            ConciliationInfo: {
                FirstName: req.body.conciliationFirstName,
                MiddleInitial: req.body.conciliationMiddleInitial,
                LastName: req.body.conciliationLastName
            },
            Case: req.body.Case,
            isArchived: false
        };

        try{
            const newCase = new LuponCaseModel(caseData);
            await newCase.save();
            console.log('successfully saved');
            console.log(newCase._id)
            resp.status(200).json({ message: 'Case successfully saved', redirectUrl: `/lupon-view-case/${newCase._id}` });
            //resp.redirect(`/lupon-view-case/${newCase._id}`);
        } catch(error){
            console.error('Error saving the case:', error);
            resp.redirect('/lupon-create');
        }
    });

    //Lupon Case View
    app.get('/lupon-view-case/:_id', async function(req, resp){
        const caseID = req.params._id;
        console.log(caseID);

        let resolveStat = 'selected';
        let ongoingStat = 'disabled';
        let isEditable = "hidden";


        try {
            const caseDetails = await LuponCaseModel.findOne({ _id: caseID }).lean();
            if (caseDetails) {
                console.log('found case');
                const respondentInfo = caseDetails.RespondentInfo;
                const complainerInfo = caseDetails.ComplainerInfo;
                const mediationInfo = caseDetails.MediationInfo;
                const conciliationInfo = caseDetails.ConciliationInfo;



                if(caseDetails.Status == 'Ongoing'){
                    resolveStat = 'disabled';
                    ongoingStat = 'selected';
                    isEditable = '';
                }
                req.session.lastpage = `/lupon-view-case/${caseID}`;
                resp.render('lupon-view-case', {
                    layout: 'index-view-tl', 
                    title: 'View Lupon Case',
                    case: caseDetails,
                    resolveStat: resolveStat,
                    ongoingStat: ongoingStat,
                    respondentInfo: respondentInfo,
                    complainerInfo: complainerInfo,
                    mediationInfo:  mediationInfo,
                    conciliationInfo: conciliationInfo,
                    isEditable : isEditable
                });
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
            resp.status(500).send('Internal Server Error');
        }

    });


    //lupon archived case view
    app.get('/lupon-view-archived/:_id', async function (req, resp){
        const caseID = req.params._id;
        console.log(caseID);

        let resolveStat = 'selected';
        let ongoingStat = 'disabled';
        let isEditable = "hidden";


        try {
            const caseDetails = await LuponCaseModel.findOne({ _id: caseID }).lean();
            if (caseDetails) {
                console.log('found case');
                const respondentInfo = caseDetails.RespondentInfo;
                const complainerInfo = caseDetails.ComplainerInfo;
                const mediationInfo = caseDetails.MediationInfo;
                const conciliationInfo = caseDetails.ConciliationInfo;



                if(caseDetails.Status == 'Ongoing'){
                    resolveStat = 'disabled';
                    ongoingStat = 'selected';
                    isEditable = '';
                }
                req.session.lastpage = `/lupon-view-archived/${caseID}`;
                resp.render('lupon-view-archived', {
                    layout: 'index-view-tl', 
                    title: 'View Lupon Case',
                    case: caseDetails,
                    resolveStat: resolveStat,
                    ongoingStat: ongoingStat,
                    respondentInfo: respondentInfo,
                    complainerInfo: complainerInfo,
                    mediationInfo:  mediationInfo,
                    conciliationInfo: conciliationInfo,
                    isEditable : isEditable
                });
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    //Lupon Edit case
    app.get('/lupon-edit-case/:_id', async function(req, resp){
        const caseID = req.params._id;
        console.log(caseID);
        let resolveStat = 'selected';
        let ongoingStat = '';

        try {
            const caseDetails = await LuponCaseModel.findOne({ _id: caseID }).lean();
            if (caseDetails) {
                console.log('found case');
                const respondentInfo = caseDetails.RespondentInfo;
                const complainerInfo = caseDetails.ComplainerInfo;
                const mediationInfo = caseDetails.MediationInfo;
                const conciliationInfo = caseDetails.ConciliationInfo;

                if(caseDetails.Status == 'Ongoing'){
                    resolveStat = '';
                    ongoingStat = 'selected';
                }

                req.session.lastpage = `/lupon-edit-case/${caseID}`;
                resp.render('lupon-edit-case', {
                    layout: 'index-edit', 
                    title: 'Edit Lupon Case',
                    case: caseDetails,
                    respondentInfo: respondentInfo,
                    complainerInfo: complainerInfo,
                    mediationInfo:  mediationInfo,
                    conciliationInfo: conciliationInfo,
                    resolveStat: resolveStat,
                    ongoingStat: ongoingStat
                });
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error fetching case details:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    //Lupon update
    app.post('/update-lupon-case/:_id', async function(req, resp){
        const{
            caseTitle,
            caseType,
            status,
            respondentFirstName,
            respondentMiddleInitial,
            respondentLastName,
            complainerFirstName,
            complainerMiddleInitial,
            complainerLastName,
            mediationFirstName,
            mediationMiddleInitial,
            mediationLastName,
            conciliationFirstName,
            conciliationMiddleInitial,
            conciliationLastName,
            Case
        } = req.body;

        if (!caseTitle || !caseType || !status || !complainerFirstName || !complainerMiddleInitial || !complainerLastName || !mediationFirstName || !mediationMiddleInitial || !mediationLastName || !respondentFirstName || !respondentLastName 
            || !conciliationFirstName || !conciliationMiddleInitial || ! respondentMiddleInitial || !conciliationLastName || !Case)
             {
            return resp.status(400).json({ message: 'All fields are required.' });
        }


        const caseID = req.params._id;

        //code to edit the case here
        try {
            // Find the case by EntryNo and update it with new values
            const updatedCase = await LuponCaseModel.findOneAndUpdate(
                { _id: caseID },
                {
                    CaseTitle: req.body.caseTitle,
                    CaseType: req.body.caseType,
                    Status: req.body.status,
                    RespondentInfo: {
                        FirstName: req.body.respondentFirstName,
                        MiddleInitial: req.body.respondentMiddleInitial,
                        LastName: req.body.respondentLastName 
                    },
                    ComplainerInfo: {
                        FirstName: req.body.complainerFirstName,
                        MiddleInitial: req.body.complainerMiddleInitial,
                        LastName: req.body.complainerLastName
                    },
                    MediationInfo: {
                        FirstName: req.body.mediationFirstName,
                        MiddleInitial: req.body.mediationMiddleInitial,
                        LastName: req.body.mediationLastName
                    },
                    ConciliationInfo: {
                        FirstName: req.body.conciliationFirstName,
                        MiddleInitial: req.body.conciliationMiddleInitial,
                        LastName: req.body.conciliationLastName
                    },
                    Case: req.body.Case,
                    isArchived: false
                },
                { new: true } // Return the updated document
            );

            if (updatedCase) {
                resp.status(200).json({ message: 'Case successfully updated', redirectUrl: `/lupon-view-case/${updatedCase._id}` });
                //resp.redirect(`/lupon-view-case/${updatedCase._id}`); // Redirect to the homepage after successful update
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error updating case details:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    //Lupon delete change
    app.get('/lupon-delete-case/:_id', async function(req, resp){
        const caseID = req.params._id;
        try{
            //delete code
            const deletedCase = await LuponCaseModel.findOneAndDelete({_id: caseID});

            if(deletedCase){
                resp.redirect('/lupon-home');
            }else{
                resp.status(404).send('Case not found');
            }
        }catch(error){
            console.error('Error deleting the case:', error);
            // Respond with a 500 status in case of an error
            resp.status(500).send('An error occurred while deleting the case');
        }
    });

    //Lupon Mark Resolved
    app.get('/lupon-mark-resolve/:_id', async function(req, resp){
        const caseID = req.params._id;
        try{
            const markResolve = await LuponCaseModel.findOneAndUpdate({_id: caseID}, {Status: "Resolved"}, {new: true});
            if (markResolve){
                resp.redirect('/lupon-home');
            }
            else{
                resp.status(404).send('Case not found');

            }
        } catch (error){
            console.error('Error resolving case details:', error);
            resp.redirect('/lupon-home');
        }
    });

    //changee
    app.post('/lupon-delete-cases', async function(req, resp) {
        const { caseIds } = req.body;
        try {
            await LuponCaseModel.deleteMany({ _id: { $in: caseIds } });
            resp.json({ success: true });
        } catch (error) {
            console.error('Error deleting cases:', error);
            resp.json({ success: false });
        }
    });

    //new archive function - lupon 
    app.get('/archive-lupon-case/:_id', async function(req, resp){
        const caseID = req.params._id;

        try {
            // Find the case by EntryNo and update it with new values
            const updatedCase = await LuponCaseModel.findOneAndUpdate(
                { _id: caseID },
                {
                    isArchived: true
                },
                { new: true } // Return the updated document
            );

            if (updatedCase) {
                resp.redirect(`/lupon-home`);
                //resp.redirect(`/lupon-view-case/${updatedCase._id}`); // Redirect to the homepage after successful update
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error updating case details:', error);
            resp.status(500).send('Internal Server Error');
        }

    });

    //restore archived case -lupon
    app.get('/restore-lupon-case/:_id', async function(req, resp){
        const caseID = req.params._id;

        try {
            // Find the case by EntryNo and update it with new values
            const updatedCase = await LuponCaseModel.findOneAndUpdate(
                { _id: caseID },
                {
                    isArchived: false
                },
                { new: true } // Return the updated document
            );

            if (updatedCase) {
                resp.redirect(`/lupon-home`);
                //resp.redirect(`/lupon-view-case/${updatedCase._id}`); // Redirect to the homepage after successful update
            } else {
                resp.status(404).send('Case not found');
            }
        } catch (error) {
            console.error('Error updating case details:', error);
            resp.status(500).send('Internal Server Error');
        }

    });


    app.post('/lupon-resolve-cases', async function(req, resp) {
        const { caseIds } = req.body;
        try {
            await LuponCaseModel.updateMany({ _id: { $in: caseIds } }, { $set: { Status: 'Resolved' } });
            resp.json({ success: true });
        } catch (error) {
            console.error('Error marking cases as resolved:', error);
            resp.json({ success: false });
        }
    });

    app.post('/lupon-resolve-onClick', async function(req, resp){
        try{
            const caseId = req.body.caseId;
            if(!caseId){
                return resp.status(400).json({ success: false, message: 'Case ID is required'});

            }

            await LuponCaseModel.findByIdAndUpdate(caseId, {Status: 'Resolved'});

            resp.json({ success: true});
         }catch (error){
            console.error('Error updating case status:', error);
            resp.status(500).json({ success: false, message: 'Internal Server Error' });
         }
    });

    function finalClose(){
    
        console.log('Close connection at the end!');
        mongoose.connection.close();
        process.exit();
    }
    
    process.on('SIGTERM',finalClose);  //general termination signal
    process.on('SIGINT',finalClose);   //catches when ctrl + c is used
    process.on('SIGQUIT', finalClose); //catches other termination commands
}

module.exports.add = add;