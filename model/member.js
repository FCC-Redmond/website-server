'use strict';

const mongoose = require('mongoose');

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
        required: true
    },
    modifiedTS: {
        type: Date
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

module.exports = mongoose.model('members', memberSchema);
