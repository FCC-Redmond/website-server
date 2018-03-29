'use strict';

const mongoose = require('mongoose');

//define a schema
var Schema = mongoose.Schema;
const memberSchema = new Schema({
    gitHubUserName: String,
    lastName: String,
    firstName: String,
    skills: Array,
    profileUrl: String,
    linkedInUrl: String,
    gitHubUrl: String,
    email: String,
    addTS: {
        type: Date,
        required: true
    },
    modifiedTS: {
        type: Date
    }
});

module.exports = mongoose.model('members', memberSchema);
