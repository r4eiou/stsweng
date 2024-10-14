const express = require('express');
const app = express();
const admin_loginRoutes = require('./routes/admin-loginRoutes');
const admin_tanodRoutes = require('./routes/admin-tanodRoutes');
const admin_luponRoutes = require('./routes/admin-luponRoutes');
const certificate_PrintingRoutes = require('./routes/certificate-printingRoutes');
const accoutns_Routes = require('./routes/account-ManageRoutes');
const mongo_uri = require("./models/database/mongoose").mongo_uri;
const { registerHelpers } = require('./helpers/handlebarHelpers');

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

app.get('/', function(req, res){
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
        });
    }
});

app.get('/index', function(req, res){
    res.render('index',{
        layout: 'layout',
        title: 'Barangay Parang - Initial Login Page',
        cssFile1: 'index',
        cssFile2: null,
        javascriptFile1: null,
        javascriptFile2: null,
    });
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

const controllers = ['employee-tanod-lupon-routes']; //ung mga get eme nasa controller
for(var i=0; i<controllers.length; i++){
  const model = require('./controllers/'+controllers[i]);
  model.add(app);
}

const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log('Listening at port '+ port);
});