'use strict';

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Member = require('../model/member.js');
const basicAuth = require('../lib/basic-auth.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/signin', (req, res) => {
  let [email, password] = basicAuth(req, res);
  console.log('username', email, 'password', password);
  Member.findOne({
      'email': email
  }).then(member => {
    console.log('user found', member);
    member.checkPassword(password).then(result => {
      if (result) {
        let data = { _id: member._id };
        let token = jwt.sign(data, process.env.SECRET, (err, newToken) => {
          console.log('newToken', newToken);
          res.status(200);
          res.send({
            signedIn: true,
            token: newToken,
          });
        });
      } else {
        res.status(401).send('please re-enter password');
      }
    });
  }).catch(err => {
    console.error('error finding user email', err);
  });
});

module.exports = router;