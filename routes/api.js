'use strict';

var express = require('express');
var router = express.Router();
var database = require('../model/db.js');

/**GET method to list members. Need to hook it up to DB */
var getMembers = async function (req, res, next) {
    try {
        var list = await database.list();
        res.send(list);
    } catch (err) {
        onError(res);
        console.error(err);
    }
};


var getMemberByLastName = async function (req, res, next) {
    var lastName = req.params.lName;
    try {
        var member = await database.findMember(lastName);
        res.send(member);

    } catch (err) {
        onError(res);
        console.error(err);
    }
};

var getMembersBySkills = async function (req, res, next) {
    var skills = req.query.skills;
    try {
        var members = await database.findMembersBySkills(skills);
        res.send(members);

    } catch (err) {
        onError(res);
        console.error(err);
    }
};

let onError = function (res) {
    let error = new Error('Server Error');
    error.status = 500;
    res.send(error);
};
//setup your routes
router.get('/members/list', getMembers);
router.get('/member/:lName', getMemberByLastName);
router.get('/members/', getMembersBySkills);

module.exports = router;