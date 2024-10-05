//skeleton file for EVENTS CONTROLLER

// const EventsModel = require("../models/database/mongoose").EventsModel; 

//database view
const viewEventsDB = async (req, res) => {
    try {
        //add session.lastpage
        //add pagination

                    
        //res render events-db-view (filename)
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

