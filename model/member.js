'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

//define a schema
var Schema = mongoose.Schema;
const memberSchema = new Schema({
    lastName: String,
    firstName: String,
    skills: Array,
    imageUrl: String,
    profileUrl: String,
    portfolioUrl: String,
    linkedInUrl: String,
    gitHubUrl: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    addTS: {
        type: Date,
        required: true
    },
    modifiedTS: {
        type: Date
    }
});

memberSchema.methods.checkPassword = function (attempt) {
    return bcrypt.compare(attempt, this.password);
  };

//validation before save
memberSchema.pre('save', function (next) {
    if (this.isNew) {
        bcrypt.hash(this.password, 10).then(hash => {
          this.password = hash;
          next();
        }).catch(err => console.error(err));
    } else {
        next();
    };
});

module.exports = mongoose.model('members', memberSchema);
