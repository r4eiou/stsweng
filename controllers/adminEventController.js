// const viewEventsDB = async (req, res) => {
//     req.session.lastpage = '/admin-homepage';
//     res.render('admin-event-db-view',{
//         layout: 'layout',
//         title: 'Barangay Parang - Admin Event DB View'
//     });
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

// module.exports = {
//     viewEvents,
//     viewArchivedEvents,
//     viewEventsDB,
//     createEvent,
//     editEvent
// }