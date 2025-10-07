var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
const agentHelper = require("../helper/agentAuthHelper")


/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render("pages/Auth/agent-login")
});
router.post('/api/agent/login',async function(req, res, next) {
  console.log(req.body);
  await agentHelper.loginAgent(req, res)
});

router.get('/not-found',async function(req, res, next) {
  res.render("error")
});
module.exports = router;
