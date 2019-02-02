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
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');
const csrf = require('csurf');
const passport = require('./config/passport');
const flash = require('express-flash');

const appConfig = require('./config/app-config');

const indexRouter = require('./routes/index');

const app = express();

// view engine setup
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(appConfig.session.secret));
app.use(
    sassMiddleware({
        src: path.join(__dirname, 'public'),
        dest: path.join(__dirname, 'public'),
        indentedSyntax: false,
        sourceMap: true,
    })
);

let sessionStore;

// Configure a session storage handler for express-session.
if (process.env.JAWSDB_URL) {
    sessionStore = new SequelizeStore({
        db: new Sequelize(process.env.JAWSDB_URL, {
            dialect: 'mysql',
        }),
        checkExpirationInterval: 15 * 60 * 1000,
        expiration: 24 * 60 * 60 * 1000,
    });
} else {
    sessionStore = new SequelizeStore({
        db: new Sequelize(null, null, null, {
            dialect: 'sqlite',
            storage: './session.sqlite',
        }),
        checkExpirationInterval: 15 * 60 * 1000,
        expiration: 24 * 60 * 60 * 1000,
    });
}

const sessionOptions = {
    secret: appConfig.session.secret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
};

sessionStore.sync();

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sessionOptions.cookie.secure = true;
    sessionOptions.proxy = true;
}
app.use(session(sessionOptions));

app.use(csrf({ cookie: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

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
    express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'))
);
app.use(
    '/js/lib',
    express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'))
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

// Process routes
app.use('/', indexRouter);

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
