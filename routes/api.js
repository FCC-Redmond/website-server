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
        onError();
        console.error(err);
    }
};


var getMemberByLastName = async function (req, res, next) {
    var lastName =  req.params.lName;
    try{
        var member = await database.findMember(lastName);
        res.send(member);

    } catch(err){
        onError();
        console.error(err);
    }
};

var addMember = async function (req, res, next) {
    try {
        var member = req.body;
        var member = database.insert(member);
        res.send('insert completed');
    } catch (err) {
        onError();
        console.error(err);
    }
};

let onError = function(){
    let error = new Error('Server Error');
    error.status = 500;
    res.send(error);
};
//setup your routes
router.get('/members/list', getMembers);
router.get('/member/:lName', getMemberByLastName);
router.post('/member', addMember);

module.exports = router;