var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/admin-login', function(req, res, next) {
    res.render('pages/Auth/admin-login', )
});

module.exports = router;
