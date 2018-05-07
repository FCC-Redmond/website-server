'use strict';

const jwt = require('jsonwebtoken');
const Member = require('../model/member.js');

function processBearer(req, res, next) {
  console.log('in bearer middleware');
  let authHeader = req.get('Authorization');
  console.log('auth header', authHeader);
  var token = authHeader.split('Bearer ')[1];
  console.log('token from header', token);
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      res.status(401).send('invalid token');
    }
    console.log('in jwt verify', decoded);
    Member.findOne({_id: decoded._id })
      .then(user => {
        console.log('jwt user found', user);
        req.user = user;
        next();
      })
      .catch(err => res.send(err.message));
  });
}

module.exports = processBearer;