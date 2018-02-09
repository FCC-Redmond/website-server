'use strict';

const mongoose = require('mongoose');
var config = require('../config.js');
// mongodb connection
const DATABASE_URL = process.env.MONGODB_URI || config.database.url;

//define a schema
var Schema = mongoose.Schema;
const memberSchema = new Schema({
    lastName: String,
    firstName: String,
    skills: Array,
    profileUrl: String,
    linkedInUrl: String,
    gitHubUrl: String,
    email: String,
    addTS: {
        type: Date,
        required: true,
        default: Date.now
    },
    modifiedTS: {
        type: Date,
        required: true,
        default: Date.now
    }
});

//validation before save
memberSchema.pre('save', function (next) {
    var self = this;
    members.find({
        "email": this.email
    }, function (err, members) {
        if (err) {
            next(err);
        }
        if (members.length == 0) {
            next();
        } else {
            console.log('User exists: ' + self.firstName + " " + self.lastName);
            next(new Error(JSON.stringify({
                "success": false,
                "message": "User Exists!"
            })));
        }
    }).exec();
});
//define a model
const members = mongoose.model('members', memberSchema);

var listMembers = function (error, members) {
    if (error) {
        return error;
        console.error('Inside listMembers:' + error);
    }
    console.log(members);
};


var getMember = function (error, member) {
    if (error) {
        return error;
    }
    console.log(member);
};
var getMembersWithSkills = function (error, members) {
    if (error) {
        return error;
    }
    console.log(members);
};

try {
    let options = {
        "autoReconnect": true,
        "reconnectTries": Number.MAX_VALUE,
        "reconnectInterval": 500
    };
    mongoose.Promise = global.Promise;
    mongoose.connect(DATABASE_URL, options).then(function () {
        console.info(`Mongoose connection successfully created`);
    }).catch(function (error) {
        console.error(`Error on connection: ${error}`);
    });
    var db = mongoose.connection;

    // When successfully connected
    mongoose.connection.on('connected', function () {
        /**
         * Start the webserver when connection is established
         */
        require('../server.js').startup();
        console.log('Mongoose default connection open to ' + DATABASE_URL);
    });

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {
        console.log('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        /**
         * Shutdown web server if the DB is unavilable
         */
        require('../server.js').shutdown();
        console.log('Mongoose default connection disconnected');

    });
    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });

} catch (err) {
    console.log('Catastrophic error in connecting to MongoDb: ' + err);
}

module.exports.list = function () {
    return members.find(listMembers).exec();
};

module.exports.findMember = function (lName) {
    return members.findOne({
        "lastName": {
            $regex: new RegExp(lName, "i")
        }
    }, getMember).exec();
};

module.exports.addMember = function (memberObj) {
    return members.insert(memberObj, getMember).exec();
}
/**
 * @param {String} skills Comma separate string of skills to query with
 */
module.exports.findMembersBySkills = function (skills) {
    return members.find({
        "skills": {
            $all: skills.split(",")
        }
    }, getMembersWithSkills).exec();
};

/**
 * @param {Object} memberProfile JSON file with member profile payload 
 * @param {*}      cb            callback
 */
module.exports.addMember = function (memberProfile, cb) {
    cb = typeof (cb) === 'function' ? cb : function () {};
    let newMember = new members(memberProfile);
    newMember.save(function (err, doc) {
        console.debug(doc);
        cb(err, doc);
    });
};

/**
 * 
 * @param {Object} memberProfile  Member profile object that has the updates requester by caller
 * @param {String} memberId       Member ID
 * @param {*}      cb             Callback function  
 */
module.exports.updateMember = function (memberProfile, memberId, cb) {
    //check whether the callback is a callable function
    cb = typeof (cb) === 'function' ? cb : function () {};

    //build your update object with modifiedTS updated
    let keyVal = {};
    for (var item in memberProfile) {
        if (memberProfile.hasOwnProperty(item)) {
            if (item === "modifiedTS") {
                keyVal[item] = Date.now();
            } else {
                keyVal[item] = memberProfile[item];
            }
        }
    }
    members.findByIdAndUpdate(memberId, {
        $set: keyVal
    }, {
        new: true
    }, function (error, updatedMember) {
        cb(error, updatedMember);
    });
};