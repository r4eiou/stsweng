/*
    I followed the database design but removed the Person Schema and included it directly in the LuponCase and TanodCase schemas
 */

const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/BrgyParang_Database')
//   .then(() => {
//     console.log('Connection successful');
//   })
//   .catch((error) => {
//     console.error('Something went wrong', error);
// });

const mongo_uri = 'mongodb+srv://admin_parang:YT66GhDJ43QUqVpT@stsweng.2sxw2.mongodb.net/brgy_parang?retryWrites=true&w=majority&appName=STSWENG';

const run = async () => {
    await mongoose.connect(mongo_uri);
    console.log("Connected to myDB");
  }
  
  run()
  .catch((err) => console.error(err))

// SCHEMA //
const CertificateSchema = new mongoose.Schema ({
    _id: {
        type: String,
        required: true
    },
    img : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    birthday : {
        type: String,
        required: true
    },
    birthplace : {
        type: String,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    ctc_no : {
        type: Number,
        required: true
    },
    ctc_date_issued : {
        type: String,
        required: true
    },
    ctc_location : {
        type: String,
        required: true
    },
    cert_date_issued : {
        type: String,
        required: true
    },
    reason : {
        type: String,
        required: true
    }
});

const UserSchema = new mongoose.Schema ({
    _id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
});

const LuponCase = new mongoose.Schema ({
    _id: {
        type: String,
        required: true
    },
    CaseTitle: {
        type: String,
        required: true,
    },
    CaseType: {
        type: String,
        required: true,
    },
    Status: {
        type: String,
        required: true,
    },
    RespondentInfo: {
        FirstName: {
            type: String,
            required: true,
        },
        MiddleInitial: {
            type: String,
            required: true,
        },
        LastName: {
            type: String,
            required: true,
        },
    },
    ComplainerInfo: {
        FirstName: {
            type: String,
            required: true,
        },
        MiddleInitial: {
            type: String,
            required: true,
        },
        LastName: {
            type: String,
            required: true,
        },
    },
    MediationInfo: {
        FirstName: {
            type: String,
            required: true,
        },
        MiddleInitial: {
            type: String,
            required: true,
        },
        LastName: {
            type: String,
            required: true,
        },
    },
    ConciliationInfo: {
        FirstName: {
            type: String,
            required: true,
        },
        MiddleInitial: {
            type: String,
            required: true,
        },
        LastName: {
            type: String,
            required: true,
        },
    },
    Case: {
        type: String,
        required: true,
    },
    isArchived: {
        type: Boolean,
        required: true
    }
});

const TanodCase = new mongoose.Schema ({
    _id: {
        type: String,
        required: true
    },
    EntryNo: {
        type: Number,
        required: true,
    },
    Date: {
        type: String,
        required: true,
    },
    Status: {
        type: String,
        required: true,
    },
    ReporteeInfo: {
        FirstName: {
            type: String,
            required: true,
        },
        MiddleInitial: {
            type: String,
            required: true,
        },
        LastName: {
            type: String,
            required: true,
        },
        Address: {
            type: String,
            required: true
        }
    },
    natureOfBlotter: {
        type: String,
        required: true
    },
    RespondentInfo: {
        FirstName: {
            type: String,
            required: true,
        },
        MiddleInitial: {
            type: String,
            required: true,
        },
        LastName: {
            type: String,
            required: true,
        },
    },
    DeskOfficerInfo: {
        FirstName: {
            type: String,
            required: true,
        },
        MiddleInitial: {
            type: String,
            required: true,
        },
        LastName: {
            type: String,
            required: true,
        },
    },
    WitnessInfo: {
        FirstName: {
            type: String,
            required: true,
        },
        MiddleInitial: {
            type: String,
            required: true,
        },
        LastName: {
            type: String,
            required: true,
        },
    },
    Location: {
        type: String,
        required: true
    },
    isArchived: {
        type: Boolean,
        required: true
    }
});

const SecurityQuestion = new mongoose.Schema ({
    _id: {
        type: String,
        required: true
    },
    Question: {
        type: String,
        required: true,
    },
    Answer: {
        type: String,
        required: true,
    },
});

const ResidentSchema = new mongoose.Schema ({
    img : {
        type: String,
        required: true
    },
    _id: {
        type: String,
        required: true
    },
    FirstName: {
        type: String,
        required: true,
    },
    MiddleInitial: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    Email : {
        type: String,
        required: true
    },
    Birthday : {
        type: String,
        required: true
    },
    Sex : {
        type: String,
        required: true
    },
    Address : {
        type: String,
        required: true
    },
    Birthday : {
        type: String,
        required: true
    },
    isSeniorCitizen : {
        type: String,
        required: true
    },
    ContactNo : {
        type: Number,
        required: true
    },
    CivilStatus : {
        type: String,
        required: true
    },
    NoOfResident : {
        type: Number,
        required: true
    },
    HousingInfo : { //rent / own
        type: String,
        required: true
    },
    ServiceRequestID : { // can be null
        type: Number,
        required: true
    },
});

const CertificateInfo = new mongoose.Schema ({
    _id: {
        type: String,
        required: true
    },
    img : {
        type: String, //di ko pa sure
        required: true
    },
    brgy_capt_name: {
        type: String,
        required: true,
    },
    slogan: {
        type: String,
        required: true,
    },
});


// MODELS //
const CertificateModel          = mongoose.model("CertificateModel",        CertificateSchema,     "certificate");
const UserModel                 = mongoose.model("UserModel",               UserSchema,            "user");
const LuponCaseModel            = mongoose.model("LuponCaseModel",          LuponCase,             "lupon_case");
const TanodCaseModel            = mongoose.model("TanodCaseModel",          TanodCase,             "tanod_case");
const SecurityQuestionModel     = mongoose.model("SecurityQuestionModel",   SecurityQuestion,      "securityQuestion");
const ResidentModel             = mongoose.model("ResidentModel",           ResidentSchema,        "resident");
const CertificateInfoModel      = mongoose.model("CertificateInfoModel",    CertificateInfo,       "certificateInfo");

// EXPORTS //
module.exports = {
    CertificateModel,
    UserModel,
    LuponCaseModel,
    TanodCaseModel,
    SecurityQuestionModel,
    ResidentModel,
    CertificateInfoModel,
    mongo_uri
};