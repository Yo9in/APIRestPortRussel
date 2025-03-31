var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');

const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();

var usersRouter = require('./routes/users');
var catwayRouter = require('./routes/catways');
var reservationRouter = require('./routes/reservation');



var app = express();
app.set('views', path.join(__dirname, 'views')); // <- Dossier contenant les fichiers EJS
app.set('view engine', 'ejs'); // <- Moteur de template utilisé


app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catways', catwayRouter);
app.use('/', reservationRouter);

app.use(function(req, res, next) {
    res.status(404).json({name: 'API', version: '1.0', status: 404, message: 'not_found'});
});



module.exports = app;
