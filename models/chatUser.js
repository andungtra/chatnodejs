/**
 * Created by Duy.AnhNguyen on 2/3/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatUserSchema = new Schema({
   profileID: String,
    fullname: String,
    profilePic: String
});

module.exports = mongoose.model('ChatUser', chatUserSchema);
