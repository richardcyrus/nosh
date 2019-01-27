/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const helmet = require('helmet');
const exphbs = require('express-handlebars');
const favicon = require('express-favicon');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    sassMiddleware({
        src: path.join(__dirname, 'public'),
        dest: path.join(__dirname, 'public'),
        indentedSyntax: false,
        sourceMap: true,
    })
);
app.use(favicon(path.join(__dirname, 'public/assets/images/nosh_n.png')));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(
    '/js/lib',
    express.static(path.join(__dirname, 'node_modules/jquery/dist'))
);
app.use(
    '/js/lib',
    express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'))
);
app.use(
    '/js/lib',
    express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'))
);

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
