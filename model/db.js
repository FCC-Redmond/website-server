'use strict';

const mongoose = require('mongoose');
var config = require('../config.js');
// mongodb connection
const DATABASE_URL = process.env.MONGODB_URI || config.database.url;

//define a schema
var Schema = mongoose.Schema;
var memberSchema = new Schema({
    lastName: String,
    firstName: String,
    skills: Array,
    profileUrl: String,
    linkedInUrl: String,
    gitHubUrl: String,
    email: String
});

//define a model
var members = mongoose.model('members', memberSchema);

//members.find(listMembers).exec();

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
    mongoose.Promise = Promise;
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

module.exports.findMembersBySkills = function (skills) {
    return members.find({
        "skills": { $all: skills.split(",") }
    }, getMembersWithSkills).exec();
};