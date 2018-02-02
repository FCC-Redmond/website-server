'use strict';
'use esversion: 6';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config.js');
const http= require('http');
const debug = require('debug')('website-server:server');
const path = require('path');



const app = express();
const PORT = normalizePort(process.env.PORT || 3000);


// mongodb connection
const DATABASE_URL = process.env.DATABASE_URL || config.database.url;

//mongoose.connect(DATABASE_URL);
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));


//setup the appRoot global 

global.appRoot = path.resolve(__dirname);


// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//setup routes
var api = require('./routes/api.js');
app.use('/api/v0/', api);

/**
 * Get port from environment and store in Express.
 */
app.set('port',PORT);

/**
 * Create https server
 */
var server = http.createServer(app);
server.listen(PORT);

server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  //figure out what to do with errors

  //// render the error page
  // res.status(err.status || 500);
  // res.render('error');
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Define routes
 */

