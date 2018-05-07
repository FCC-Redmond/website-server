'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Member = require('../model/member.js');
const basicAuth = require('../lib/basic-auth.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

// router.post('/register', express.json(), (req, res) => {
//   console.log('in register route');
//   let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   let newMember = req.body;
//   console.log('req body', req.body);
//   if (!emailRegex.test(newMember.email)) {
//     console.log('email is not valid');
//     res.status(400);
//     res.send('Invalid Email');
//     return;
//   }
//   newMember.addTS = Date.now();
//   newMember.modifiedTS = "";
//   // database.addMember(newMember, cb);
//   Member.create(req.body)
//     .then((member) => {
//       res.status(200);
//       res.send({
//         message: 'Account has been successfully created',
//         // _id: user._id,
//         // isAdmin: user.isAdmin,
//         // username: user.username,
//         // email: user.email
//       });
//     })
//     .catch((err) => {
//       console.error('user not created', err);
//       res.sendStatus(400);
//     });
// });

router.get('/signin', (req, res) => {
  let [username, password] = getAuth(req, res);
  User.findOne({
    username
  }).then(user => {
    user.checkPassword(password).then(result => {
      if (result) {
        let data = { userId: user._id };
        let token = jwt.sign(data, process.env.SECRET, (err, newToken) => {
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
  });
});

module.exports = router;