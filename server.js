
// server.js

// CORE
// =============================================================================

var express    = require('express');
var mongoose   = require('mongoose');
var jwt        = require('jsonwebtoken');
var bodyParser = require('body-parser');
var morgan     = require('morgan');

var config     = require('./app/config.js');

var elsa   = express();
var router = express.Router();

mongoose.connect(config.database);

elsa.use(bodyParser.urlencoded({ extended: true }));
elsa.use(bodyParser.json());

elsa.use(morgan('dev'));

// MIDDLEWARES
// =============================================================================

// Authentication
router.use(function(req, res, next) {
    var token = req.headers['authorization'];

    // Failure by default
    req.jwt = {
        success: false,
        message: 'Unauthorized',
        status: 401
    };

    // Check the token format
    if (token && token.startsWith('Bearer ')) {
        jwt.verify(token.substr(7), config.passphrase, function(err, payload) {
            if (!err) {
                req.jwt.success = true;
                req.jwt.data = payload;
            }

            next();
        });
    }

    next();
});

// Register the middlewares
elsa.use('/api', router);

// ROUTES LOADING
// =============================================================================

var usersRoutes     = require('./app/routes/users.js');
var softwaresRoutes = require('./app/routes/softwares.js');

elsa.use('/api', usersRoutes);
elsa.use('/api', softwaresRoutes);

// SERVER
// =============================================================================

elsa.listen(3000);
