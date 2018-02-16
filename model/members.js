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

/**
 * @param {String} skills Comma separate string of skills to query with
 */
module.exports.findMembersBySkills = function (skills) {
    skills = skills.split(",");
    skills.forEach((cur, index, array) => {
        skills[index] = {
            "skills": {
                $regex: new RegExp(cur, "i")
            }
        }
    })
    return members.find({
        $and: skills
    }).exec();
};

/**
 * @param {Object} memberProfile JSON file with member profile payload 
 * @param {*}      cb            callback
 */
module.exports.addMember = function (memberProfile, cb) {
    cb = typeof (cb) === 'function' ? cb : function () { };
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
    cb = typeof (cb) === 'function' ? cb : function () { };

    //build your update object with modifiedTS updated
    let keyVal = {};
    for (var item in memberProfile) {
        if (item in memberProfile) {
            if (item === "modifiedTS") {
                keyVal[item] = Date.now();
            } else {
                keyVal[item] = memberProfile[item];
            }
        }
    }
    //In case caller didn't send modified TS
    if (!('modifiedTS' in keyVal)) {
        keyVal.modifiedTS = Date.now();
    }
    console.log("Inside member.js update. MemberProfile:"+ memberProfile);
    console.log("Inside member.js update.Member ID:" + memberId);
    members.findByIdAndUpdate(memberId, {
        $set: keyVal
    }, {
            new: true
        }, function (error, updatedMember) {
            cb(error, updatedMember);
        });
};

/**
 * 
 * @param {*} id ObjectId of member to be removed 
 * @param {*} cb Callback function 
 */
module.exports.removeMember = function (id, cb) {
    cb = typeof (cb) === 'function' ? cb : function () { };
    members.findByIdAndRemove(id, function (err, removedMember) {
        cb(err, removedMember);
    });
};