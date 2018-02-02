'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// mongodb connection
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/fccrmembers'; //amber

mongoose.connect(DATABASE_URL);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// listen on port 3000
app.listen(PORT, function () {
  console.log(`Express app listening on ${PORT}`);
});