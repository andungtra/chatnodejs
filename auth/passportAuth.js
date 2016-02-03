/**
 * Created by Duy.AnhNguyen on 2/3/2016.
 */
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    mongoose = require('mongoose'),
    secret = require('../config/secret'),
    ChatUser = require('../models/chatUser');

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    //console.log(id);
    ChatUser.findById(id, function(err, user) {
        //console.log(user);
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: secret.fb.appID,
    clientSecret: secret.fb.appSecret,
    callbackURL: secret.fb.callbackURL,
    profileFields: ['id', 'displayName', 'photos']
}, function(accessToken, refreshToken, profile, done) {
    //check if the user exists in the our MongoDb db
    //if not, create one and return the profile
    //if the user exists, simply return the profile
    ChatUser.findOne({ 'profileID' : profile.id}, function(err, chatUser){
        //console.log(chatUser);
        if(chatUser) {
            return done(null, chatUser);
        } else {
            // create a new user in our Mongolab account
            var newChatUser = new ChatUser({
               profileID:profile.id,
                fullname: profile.displayName,
                profilePic: profile.photos[0].value
            });

            newChatUser.save(function(err) {
                if(err) return done(err);

                return done(null, newChatUser);
            });
        }
    });
}));