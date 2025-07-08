var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/setting', function(req, res, next) {
    res.render('pages/settings/setting', )
});

module.exports = router;
