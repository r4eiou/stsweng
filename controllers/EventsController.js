//skeleton file for EVENTS CONTROLLER

const EventsModel = require("../models/database/mongoose").EventsModel;

//database view
const viewEventsDB = async (req, res) => {
  try {
    //add session.lastpage
    //add pagination

    res.render("admin-events-db", {
      layout: "layout",
      title: "Admin: Events DB viewing",
      cssFile1: "homepage",
      cssFile2: "db-view",
      javascriptFile1: "components",
      javascriptFile2: "header",
    });

    //res render events-db-view (filename)
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// create Event
const createEvent = async (req, res) => {
  try {
    //add session.lastpage
    //add pagination

    res.render("admin-create-event", {
      layout: "layout",
      title: "Admin: Creating a New Event",
      cssFile1: "homepage",
      cssFile2: "db-view",
      javascriptFile1: "components",
      javascriptFile2: "header",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// edit Event
const editEvent = async (req, res) => {
  try {
    //add session.lastpage
    //add pagination

    res.render("admin-edit-event", {
      layout: "layout",
      title: "Admin: Editing an Event",
      cssFile1: "homepage",
      cssFile2: "db-view",
      javascriptFile1: "components",
      javascriptFile2: "header",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// view Event
const viewEvent = async (req, res) => {
  try {
    //add session.lastpage
    //add pagination

    res.render("admin-view-event", {
      layout: "layout",
      title: "Admin: Viewing Event Details",
      cssFile1: "db-view",
      cssFile2: "index",
      javascriptFile1: "components",
      javascriptFile2: "header",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  viewEventsDB,
  createEvent,
  editEvent,
  viewEvent
};
