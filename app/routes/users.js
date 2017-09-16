
// app/routes/users.js

var express = require('express');
var jwt     = require('jsonwebtoken');
var crypto  = require('crypto');

var router  = express.Router();

var config  = require('../config.js');

var User    = require('../models/user.js');

// ROUTES
// =============================================================================

// Authenticate the user
router.route('/users/authenticate').post(function(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) res.send(err);

        if (!user) {
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (!user.checkPassword(req.body.password)) {
            res.json({
                success: false,
                message: 'Authentication failed. Wrong password'
            });
        } else {
            res.json({
                success: true,
                message: 'Authenticated',
                token: jwt.sign(user, config.passphrase, { expiresIn: 86400 })
            });
        }
    });
});

// Register new user
router.route('/users/register').post(function(req, res) {
    var user = new User();

    user.email    = req.body.email;
    user.username = req.body.username;

    user.setPassword(req.body.password);

    user.save(function(err) {
        if (err) res.send(err);

        res.json({
            message: 'User registered'
        });
    });
});

// Get user info
router.route('/users/profile/:user_id').get(function(req, res) {
    User.findOne({ username: req.params.username }, function(err, user) {
        if (err) res.send(err);

        res.json(user);
    });
});

// Update user info
router.route('/users/profile/:user_id').put(function(req, res) {
    if (!req.jwt.success) {
        return res.status(req.jwt.status).json({ message: req.jwt.message });
    }

    User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'User updated' });
        });
    });
});

module.exports = router;
