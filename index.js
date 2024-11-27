const express = require('express');
const app = express();
const admin_loginRoutes = require('./routes/admin-loginRoutes');
const admin_tanodRoutes = require('./routes/admin-tanodRoutes');
const admin_luponRoutes = require('./routes/admin-luponRoutes');
const certificate_PrintingRoutes = require('./routes/certificate-printingRoutes');
const accoutns_Routes = require('./routes/account-ManageRoutes');
const employee_residentRoutes = require('./routes/employee_residentRoutes');
const loginSignup_Routes = require('./routes/loginSignup-Routes');
const admin_residentRoutes = require('./routes/admin-residentRoutes');
const admin_eventRoutes = require('./routes/admin-eventRoutes');
const mongo_uri = require("./models/database/mongoose").mongo_uri;
const { registerHelpers } = require('./helpers/handlebarHelpers');
const {EventModel}  = require('./models/database/mongoose');

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

//This is a new library called Body Parser. This system will parse the data
//from its internal JSon system to make request messages simpler.
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const hbsHelpers = {
    sortField: (field, sortField) => field === sortField ? 'sorted' : '',
    sortOrder: (sortField, currentSortField, currentSortOrder) => {
        if (sortField === currentSortField) {
            return currentSortOrder === 'asc' ? 'ascending' : 'descending';
        }
        return '';
    }
};

const handlebars = require('express-handlebars');
app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    helpers: hbsHelpers
}));

//session
const session = require('express-session')
const mongoStore = require('connect-mongodb-session')(session);

app.use(session({
    secret: 'brgyParang',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({ 
        uri: mongo_uri,
        collection: 'mySession',
    }),
}));

app.get('/', async function(req, res){

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
        if (req.session.isAuth && req.session.lastpage) {
            res.redirect(req.session.lastpage);
        } else {
            res.render('index',{
                layout: 'layout',
                title: 'Barangay Parang - Initial Login Page',
                cssFile1: 'index',
                cssFile2: null,
                javascriptFile1: null,
                javascriptFile2: null,
                events: allEvents,
            });
        }
    }catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/index', async function(req, res){
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
    
            res.render('index',{
                layout: 'layout',
                title: 'Barangay Parang - Initial Login Page',
                cssFile1: 'index',
                cssFile2: null,
                javascriptFile1: null,
                javascriptFile2: null,
                events: allEvents,
            });
    }catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/index');
        }
        else {
            res.clearCookie('connect.sid'); 
            return res.redirect('/index');
        }
    });
});

app.get('/api/getUserRole', (req, res) => {
    res.json({ userRole: req.session.userRole || "" });
});

//helpers
registerHelpers();

//login route
app.use(admin_loginRoutes);

//admin tanod routes
app.use(admin_tanodRoutes);

//admin lupon routes
app.use(admin_luponRoutes);

//certofocate printing routes
app.use(certificate_PrintingRoutes);

//manage accounts
app.use(accoutns_Routes);

//all login
app.use(loginSignup_Routes);

// admin residents route

app.use(admin_residentRoutes);

app.use(employee_residentRoutes);

// admin events routes
//app.use(admin_eventRoutes);


const controllers = ['employee-tanod-lupon-routes']; //ung mga get eme nasa controller
for(var i=0; i<controllers.length; i++){
  const model = require('./controllers/'+controllers[i]);
  model.add(app);
}

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, function () {
        console.log('Listening at port ' + port);
    });
}

module.exports = app; // Export the app for testing
