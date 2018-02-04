'use strict';

const mongoose = require('mongoose');
var config = require('../config.js');
// mongodb connection
const DATABASE_URL = process.env.DATABASE_URL || config.database.url;

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

try {
    mongoose.connect(DATABASE_URL, function (err) {
        console.log('Error on connection: ' + err);
    });
    var db = mongoose.connection;

    // When successfully connected
    mongoose.connection.on('connected', function () {
        console.log('Mongoose default connection open to ' + DATABASE_URL);
    });

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {
        console.log('Mongoose default connection error: ' + err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
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
        lastName: lName
    }, getMember).exec();
};