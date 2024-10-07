//skeleton file for EVENTS CONTROLLER

const EventsModel = require("../models/database/mongoose").EventsModel; 

//database view
const viewEventsDB = async (req, res) => {
    try {
        //add session.lastpage
        //add pagination

        res.render('admin-events-db', {
            layout: 'layout',
            title: 'Admin: Events DB viewing',
            cssFile1: 'homepage',
            cssFile2: 'db-view',
            javascriptFile1: 'components',
            javascriptFile2: 'header'
        });

        
        //res render events-db-view (filename)
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    viewEventsDB
};
