var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();
const adminHelper = require("../helper/adminHelper")

router.get('/create-admin/:name/:email/:password', async (req, res, next) => {
  console.log("Creating admin with params:", req.params);
  const { name, email,} = req.params;
  // Basic validations
  if (!email || !name ) return res.status(400).send({ error: "Email and name are required" });
  await adminHelper.createAdmin(req,res)
})

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render("pages/Auth/admin-login")
});
router.post('/api/admin/login',async function(req, res, next) {
  console.log(req.body);
  await adminHelper.loginAdmin(req, res)
});
router.post('/api/auth/verify-otp',async function(req, res, next) {
  console.log(req.body);
  await adminHelper.verifyOTPUser(req, res)
});

router.get('/send-msg',async function(req, res, next) {
  await adminHelper.sendOTP(req, res)
  res.render("pages/user-Auth/auth")
});
router.get('/not-found',async function(req, res, next) {
  res.render("error")
});
module.exports = router;
