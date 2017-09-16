
// app/models/user.js

var crypto   = require('crypto');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
    email:    { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    hash:     { type: String, required: true },
    salt:     { type: String, required: true },
    meta: {
        comment: String,
        website: String
    },
    date_created: Date,
    date_updated: Date
});

UserSchema.pre('save', function(next) {
    var now = new Date();

    if (!this.date_created) {
        this.date_created = now;
    }

    this.date_updated = now;

    next();
});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

UserSchema.methods.checkPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
}

module.exports = mongoose.model('User', UserSchema);
