var express = require('express');
var router = express.Router();
const settingHelper = require('../helper/settingHelper'); 

/* GET users listing. */
router.get('/setting', function(req, res, next) {
    res.render('pages/settings/setting', )
});

router.get('/api/settings/website',async function(req, res, next) {
   await settingHelper.getWebsiteDetails(req, res);
});
router.post('/api/settings/website',async function(req, res, next) {
    console.log(req.body);
   await settingHelper.updateWebsiteDetails(req, res);
});

router.get('/api/settings/admin',async function(req, res, next) {
   await settingHelper.getAdminDetails(req, res);
});

router.put('/api/settings/admin',async function(req, res, next) {
   console.log(req.body);
    await settingHelper.updateAdmin(req, res);
});

module.exports = router;
