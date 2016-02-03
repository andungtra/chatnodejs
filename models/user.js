/**
 * Created by Duy.AnhNguyen on 2/3/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    fullname: String
});

module.exports = mongoose.model('User', UserSchema);