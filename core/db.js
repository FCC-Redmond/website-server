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

members.find(listMembers).exec();

var listMembers = function (error, members) {
    if (error) {
        console.error('Inside listMembers:' + error);
    }
    console.log(members);
};

try {
    mongoose.connect(DATABASE_URL, function (err) {
        console.log('Error on connection: ' + err);
    });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

} catch (err) {
    console.log('Catastrophic error in connecting to MongoDb: ' + err);
}

module.exports.list = function () {
    return members.find(listMembers).exec();
};