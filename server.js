/**
 * Created by Duy.AnhNguyen on 2/2/2016.
 */
var express = require('express'),
    app = express()
    path = require('path')
    mongoose = require('mongoose'),
    secrect = require('./config/secret'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    connectMongo = require('connect-mongo/es5')(session)
    passport = require('passport'),
    rooms = [{
        room_name: 'cloud Computing',
        room_number: 98568
    }];
    //passportConfig = require('./auth/passportAuth');

mongoose.connect(secrect.dbURL, function(err) {
   if(err) {
       console.log(err);
   } else {
       console.log('Connected to database');
   }
});

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


console.log(process.env.NODE_ENV);

var env = process.env.NODE_ENV || 'development';
if(env === 'development') {
    app.use(session({
        secret: secrect.sessionSecrect,
        resave: true,
        saveUninitialized: true
    }));
} else {
    app.use(session({
        secret: secrect.sessionSecrect,
        resave: true,
        saveUninitialized: true,
        store: new connectMongo({
            url: secrect.dbURL,
            autoReconnect: true,
            stringify: true
        })
    }));
}

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    console.log(req.user);
    res.locals.user = req.user;
    next();
});

var routes = require('./routes/routes');
app.use(routes);

/*app.listen(secrect.port, function(){
   console.log('ChatCAT Working on  Port ' + secrect.port);
    console.log('Mode: ' + env);
});*/
app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket')(io, rooms);

server.listen(app.get('port'), function() {
    console.log('ChatCAT on Port : ' + app.get('port'));
});