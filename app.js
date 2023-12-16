// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// const catalogRouter = require("./routes/catalog");

// var app = express();


// // Set up mongoose connection
// const mongoose = require("mongoose");
// mongoose.set("strictQuery", false);
// const mongoDB = "mongodb+srv://user_31:QBWs9QmsK75SDGYL@cluster0.yqzcvqb.mongodb.net/local_library?retryWrites=true&w=majority";

// main().catch((err) => console.log(err));
// async function main() {
//   await mongoose.connect(mongoDB);
// }


var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config(); // Load environment variables from .env file

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');
const compression = require("compression");
const helmet = require("helmet");

var app = express();

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

// Set up mongoose connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
//const mongoDB = "mongodb+srv://user_31:QBWs9QmsK75SDGYL@cluster0.yqzcvqb.mongodb.net/local_library?retryWrites=true&w=majority"; // Use environment variable
const mongoDB = "mongodb+srv://user_31:QBWs9QmsK75SDGYL@cluster0.yqzcvqb.mongodb.net/local_library?retryWrites=true&w=majority";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);
app.use(compression());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/catalog", catalogRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

//  "start": "pm2 start ./bin/www",
//  // "start": "node ./bin/www",