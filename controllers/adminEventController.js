const { CertificateModel, UserModel, LuponCaseModel, TanodCaseModel, EventModel } = require('../models/database/mongoose');

//Set up for multer
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage();
const upload = multer({storage});


// //Admin view all events DB
// const viewEventsDB = async (req, res) => {

//     try{

//         //update inactive events
//        const currentDate = new Date();
//        const eventsToUpdate = await EventModel.find({ isArchived: false, isInactive: false });

//        for(let event of eventsToUpdate){
//            const endDate = new Date(event.end_date);

//            if(currentDate > endDate){
//                event.isInactive = true;
//                await event.save();
//            }
//        }

//        //update events to archive
//        const inactiveEvents = await EventModel.find({ isArchived: false, isInactive: true });

//        for (let event of inactiveEvents) {
//            const inactiveDuration = Math.floor((currentDate - new Date(event.end_date)) / (1000 * 60 * 60 * 24)); // Calculate the number of days since the event ended

//            // If the event has been inactive for 30 days, archive it
//            if (inactiveDuration >= 30) {
//                event.isArchived = true; // Mark the event as archived
//                await event.save(); // Save the updated event to the database
//            }
//        }


//        const searchName = req.query.search_name || '';
//        const searchRegex = new RegExp(searchName, 'i');

//        //pages
//        const page = parseInt(req.query.page) || 1;
//        const limit = 10;
//        const skip = (page - 1) * limit;

//        //get all cases with pagination
//        const events = await EventModel.find({
//            isArchived: false,
//            $or:[
//                {'header': searchRegex}
//            ]
//        })
//        .skip(skip)
//        .limit(limit)
//        .exec();

//        const totalCases = await EventModel.countDocuments({
//            isArchived: false,
//            $or:[
//                {'header': searchRegex}
//            ]
//        });

//        let allEvents = [];
//        for(const item of events){
//            let stat_lc = 'active';
//            let stat = 'Active';
//            let isEditable = 'hidden';
//            if(item.isInactive){
//                stat_lc = 'inactive';
//                isEditable = '';
//                stat = 'Inactive';
//            }

//            allEvents.push({
//                eventID : item._id,
//                headline: item.header,
//                start_date: item.start_date,
//                end_date: item.end_date,
//                details: item.details,
//                pic: item.pic,
//                status: item.Status,
//                stat_lc: stat_lc,
//                stat: stat,
//                isEditable: isEditable
//            });
//        }

//        let totalPages = 0;

//        if(totalCases == 0){
//            totalPages = 1;
//        }else{
//            totalPages = Math.ceil(totalCases/limit);
//        }
//    // const totalPages = Math.ceil(totalCases/limit);
       
//        req.session.lastpage = '/admin-homepage';

//        console.log(page, totalPages);

//        res.render('admin-event-db-view', {
//            layout: 'layout',
//            title: 'Admin Events DB', 
//            totalPages: totalPages,
//            currentPage: page,
//            events: allEvents
//        });

//    } catch(error){
//        console.error('Error fetching all cases:', error);
//        res.status(500).send('Internal Server Error');
//    }   
// };



// const viewEvents = async (req, res) => {
//     req.session.lastpage = '/admin-view-events-db';
//     res.render('admin-view-event',{
//         layout: 'layout',
//         title: 'Barangay Parang - Admin Event View Details',
//         cssFile1: 'homepage',
//         cssFile2: 'event-details'
//     }); 
// };

// const viewArchivedEvents = async (req, res) => {
//     req.session.lastpage = '/admin-view-events-db';
//     res.render('admin-view-archive-event',{
//         layout: 'layout',
//         title: 'Barangay Parang - Admin Archive Event Details',
//         cssFile1: 'homepage',
//         cssFile2: 'event-details'
//     });
// };

// const createEvent = async (req, res) => {
//     req.session.lastpage = '/admin-view-events-db';
//     res.render('admin-create-event',{
//         layout: 'layout',
//         title: 'Barangay Parang - Admin Create Event',
//         cssFile1: 'homepage',
//         cssFile2: 'event-details'
//     });
// };

// const editEvent = async (req, res) => {
//     req.session.lastpage = '/admin-view-event';
//     res.render('admin-edit-event',{
//         layout: 'layout',
//         title: 'Barangay Parang - Admin Edit Event',
//         cssFile1: 'homepage',
//         cssFile2: 'event-details'
//     });
// };

module.exports = {
    viewEvents,
    viewArchivedEvents,
    viewEventsDB,
    createEvent,
    editEvent
}