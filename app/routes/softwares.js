
// app/routes/softwares.js

var express = require('express');
var router  = express.Router();

// ROUTES
// =============================================================================

// Get user list
router.route('/softwares').get(function(req, res) {
    res.json({
        test: 'Hello, world!'
    });
});

module.exports = router;