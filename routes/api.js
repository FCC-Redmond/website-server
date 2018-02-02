'use strict';

var express = require('express');
var router = express.Router();

/**GET method to list members. Need to hook it up to DB */
var getMembers = function (req, res, next) {
    try {
        //test response
        res.send(JSON.stringify({
            "members": ['Amber Kim', 'Apoorva Teja', 'Marshall Wilcox', 'Niku']
        }));
    }catch(err){
        console.error(err);
    }
};


router.get('/members/list', getMembers);

module.exports = router;