const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const logger = require('./utility/logger')
require('dotenv').config()
logger.info(process.env.NODE_ENV) 

mongoose.connect("mongodb://127.0.0.1:27017/authdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', (error) => {
    logger.error("Error While connecting to Mongo db \n", error); 
    process.exit(0)
});
mongoose.Promise = global.Promise;

require('./auth/auth');

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	logger.info("Page Not found error for request", req.url);	
	const err = new Error('Page Not Found');
	err.status = 404;
	next(err);
});

// Handle errors.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});
let port = process.env.PORT || 3000;

var server = app.listen(port, () => {
  logger.info('Server started on port.', port)
});

module.exports = server;