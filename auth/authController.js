'use strict';

const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const member = require('../lib/member.js');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

let register = (req, res, next) => {
    try {
        let cb = (err, member) => {
            if (err) {
                //To be implemented - if user exists then send a variant of response

                res.status('500').send({ "success": false, "message": "There was a problem registering the member." });
            } else if (member) {
                //create token
                let token = jwt.sign({ id: member._id }, process.env.CookieSecret, { expiresIn: 86400 });
                res.status(200).send({ "success": true, "message": "Member registered successfully", "data": member, "token": token });
            }
        };
        member.addMember(req.body.memberProfile, cb);
    } catch (err) {
        res.status(500).send({ "success": false, "message": "There was a problem registering the member.", "error": err });
    }
};

let login = async (req, res, next) => {
    try {
        if(!req.body.userName){
            throw new Error("User name was not provided");
        }
        let loginUser = await member.findMemberByUserName(req.body.userName);
        if(!loginUser){
            //need to add GitHub Auth Code validation here
            res.status(401).send({"success":false, "message": "Incorrect User Name"});
        }else{
            let token = jwt.sign({id: loginUser._id}, process.env.CookieSecret, {expiresIn: 86400});
            res.status(200).send({ "success": true, "message": "Member logged in successfully", "token": token });
        }
    } catch (err) {
        res.status(500).send({ "success": false, "message": "There was a problem logging in.", "error": err });
    }
};

router.post('/register', register);
router.post('/login', login);

module.exports = router;


