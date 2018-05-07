'use strict';
'use esversion: 6';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config.js');
const http = require('http');
const debug = require('debug')('website-server:server');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = normalizePort(process.env.PORT || 3000);

//setup the appRoot global 

global.appRoot = path.resolve(__dirname);

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cors());

//setup routes
var api = require('./routes/api.js');
var auth = require('./routes/basic-auth.js');
var index = require('./routes/index.js');
app.use('/api/v0/', api);
app.use('/api/auth/', auth);
app.use('/', index);

//Setup static route
app.use(express.static(path.join(__dirname, 'public')));
/**
 * Get port from environment and store in Express.
 */
app.set('port', PORT);

/**
 * Create http server
 */
var server = http.createServer(app);


server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof PORT === 'string' ?
    'Pipe ' + PORT :
    'Port ' + PORT;

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
  console.info('Listening on ' + bind);
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

  //// render the error page
  res.status(err.status || 500);
  res.send();
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
 * Initialize MongoDB
 */

// mongodb connection
const DATABASE_URL = process.env.MONGODB_URI || config.database.url;

/**
 * Initialize Mongoose adapter for MongoDB. If connection fails on first attempt, no further attempts to connect 
 * is made. This is a fail fast strategy. If connected to DB then web server is started.
 * If connection fails after initial connection then unlimited reconnect attempts will be made. Web server will be 
 * shutdown until successful connection is established
 */
try {
  let options = {
    "autoReconnect": true,
    "reconnectTries": Number.MAX_VALUE,
    "reconnectInterval": 500
  };
  mongoose.Promise = global.Promise;
  mongoose.connect(DATABASE_URL, options).then(function () {
    console.info(`Mongoose connection successfully created`);
  }).catch(function (error) {
    console.error(`Error on connection: ${error}`);
  });
  var db = mongoose.connection;

  // When successfully connected
  mongoose.connection.on('connected', function () {
    /**
     * Start the webserver when connection is established
     */
    server.listen(PORT);
    console.log('Mongoose default connection open to ' + DATABASE_URL);
  });

  // If the connection throws an error
  mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    /**
     * Shutdown web server if the DB is unavilable
     */
    try {
      server.close();
    } catch (err) {
      console.error(`Could not shutdown web server: ${err}`);
    }
    console.log('Mongoose default connection disconnected');

  });
  // If the Node process ends, close the Mongoose connection 
  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });

} catch (err) {
  console.log('Catastrophic error in connecting to MongoDb: ' + err);
}