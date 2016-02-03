/**
 * Created by Duy.AnhNguyen on 2/2/2016.
 */
var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportCofig = require('../auth/passportAuth');
var config = require('../config/secret');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Welcome to ChatCat'});
});

router.get('/chatrooms', securePages, function(req, res, next){
    //console.log(req.user);
    res.render('chatrooms', {title: 'Chatrooms', user: req.user, config: config, rooms: rooms });
});

router.get('/logout', function(req, res, next) {
   req.logout();
    res.redirect('/');
});

router.get('/setcolor', function(req, res, next) {
   req.session.favColor = 'Red';
    res.send('Setting favourite color !');
});

router.get('/getcolor', function(req, res, next) {
   res.send('Favourite Color: ' + (req.session.favColor===undefined?"Not Found":req.session.favColor));
});

router.get('/createaccount',function(req, res, next) {
    var user = new User({
        username:'andungtra',
        password: '123456',
        fullname: 'anh duy'
    });

    user.save(function(err){
       if(err) return next(err);
        res.send('done!')
    });
});

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/chatrooms',
    failureRedirect: '/'
}));

router.get('/room/:id', function(req, res, next) {
    res.render('room', {user: req.user, room_number: req.params.id, room_name: findTitle(req.params.id), config: config });
});

function securePages(req, res, next) {
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect('/')
    }
}

function findTitle(room_id) {
    var n = 0;
    while (n < rooms.length) {
        if(rooms[n].room_number == room_id){
            return rooms[n].room_name;
            break;
        } else {
            n++;
            continue;
        }
    }
}

/*app.route('/').get(function(req, res, next) {
    res.render('index', { title: 'Welcome to ChatCat'});
});*/

module.exports = router;
