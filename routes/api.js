'use strict';

var express = require('express');
var router = express.Router();
var database = require('../model/db.js');

/**GET method to list members. Need to hook it up to DB */
var getMembers = function (req, res, next) {
    try {
        database.list().then(function (members) {
            res.send(members);
        }).catch(function (err) {
            console.error('Error getting members from DB: ' + error);
        });
    } catch (err) {
        console.error(err);
    }
};

router.get('/members/list', getMembers);

module.exports = router;