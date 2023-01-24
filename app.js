/**
 * The Coding Boot Camp at UNC Charlotte.
 * (c) 2019 Richard Cyrus, Teddy Johnson, Sara Minerva, Yobany Perez
 */

const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const createError = require('http-errors');
const csrf = require('@dr.pogodin/csurf');
const exphbs = require('express-handlebars');
const express = require('express');
const favicon = require('express-favicon');
const flash = require('express-flash');
const helmet = require('helmet');
const logger = require('morgan');
const path = require('path');
const sassMiddleware = require('express-dart-sass');
const Sequelize = require('sequelize');
const session = require('express-session');
const uuid = require('uuid');

// eslint-disable-next-line no-unused-vars
const debug = require('debug')('nosh:app');

// Import the passport.js module and configuration.
const passport = require('./config/passport');

// Import the application routes.
const routes = require('./routes');

// Create the Express Application
const app = express();

// Initialize Sequelize with session store.
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Handle Heroku Production vs Development Environment.
let sessionStore;
if (process.env.MYSQL_URL) {
    sessionStore = new SequelizeStore({
        db: new Sequelize(process.env.MYSQL_URL, {
            dialect: 'mysql',
        }),
    });
} else {
    sessionStore = new SequelizeStore({
        db: new Sequelize(process.env.MYSQLDB_URL, {
            dialect: 'mysql',
        }),
    });
}

// Configure base session options.
const sessionOptions = {
    name: 'nosh.pid',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
};

// Add production changes for session if necessary.
if (app.get('env') === 'production') {
    sessionOptions.cookie.secure = true;
    sessionOptions.proxy = true;
    app.set('trust proxy', 1);
}

// Create the session database tables if they're not there.
sessionStore.sync();

// view engine setup
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
});
app.engine('hbs', hbs.engine);
if (app.get('env') === 'production') {
    app.set('view cache', true);
}
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(generateNone);
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            'script-src': [`'self'`, getNonce],
        },
    })
);
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session(sessionOptions));
// Use the session for csrf
app.use(csrf({ cookie: false }));

app.use(
    sassMiddleware({
        src: path.join(__dirname, 'public'),
        dest: path.join(__dirname, 'public'),
        indentedSyntax: false,
    })
);

// Initialize passport.js and setup session support.
app.use(passport.initialize());
app.use(passport.session());

// Add support for flash messages.
app.use(flash());

// Set the site favicon
app.use(favicon(path.join(__dirname, 'public/assets/images/nosh_n.png')));

// Register the location of static files.
app.use('/', express.static(path.join(__dirname, 'public')));

// Register library paths for frontend modules installed with node.
app.use(
    '/js/lib',
    express.static(path.join(__dirname, 'node_modules/jquery/dist'))
);
app.use(
    '/js/lib',
    express.static(path.join(__dirname, 'node_modules/@popperjs/core/dist/umd'))
);
app.use(
    '/js/lib',
    express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'))
);
app.use(
    '/js/lib',
    express.static(path.join(__dirname, 'node_modules/bootbox/dist'))
);
app.use(
    '/js/lib/fontawesome',
    express.static(
        path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/js')
    )
);
app.use(
    '/css/lib/bootstrap-social',
    express.static(path.join(__dirname, 'node_modules/@ladjs/bootstrap-social'))
);
app.use(
    '/assets/lib/round-slider',
    express.static(path.join(__dirname, 'node_modules/round-slider/dist'))
);

/**
 * Register the user when a user is authenticated, and add key fields to
 * the session.
 *
 * Grants access to the user object in the handlebars templates.
 */
app.use((req, res, next) => {
    // This is for the templates.
    res.locals.user = req.user;

    // This is for the session, This makes a single point for management.
    if (req.user) {
        req.session.latitude = req.user.Profile.latitude;
        req.session.longitude = req.user.Profile.longitude;
        req.session.radius = req.user.Profile.radius;
        req.session.searchResults = req.user.Profile.searchResults;
    }

    // Call the next middleware function.
    next();
});

// Register the routes.
app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

function generateNone(req, res, next) {
    // This is for inline-scripts.
    const rhyphen = /-/g;
    res.locals.nonce = uuid.v4().replace(rhyphen, ``);
    next();
}

function getNonce(req, res) {
    return `'nonce-${res.locals.nonce}'`;
}

module.exports = app;
