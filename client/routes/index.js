var express = require('express');
var router = express.Router();
var startFun= require("../helper/startingHelper")
var indexFun= require("../helper/indexHelper")

router.get('/time',async function(req, res, next) {
  res.json({date: new Date()})
});

/* GET home page. */
router.get('/',async function(req, res, next) {
  await indexFun.getLotteries(req,res)
});

router.post('/api/get-past-lottories',async function(req, res, next) {
  await indexFun.getPastLotteries(req,res)
});

router.post('/api/refresh-results',async function(req, res, next) {
  await indexFun.refreshResults(req,res)
});


router.get('/create-dummy-lottories',async function(req, res, next) {
 try {
  let savedLotteries = await startFun.saveDummyLotteries(req, res);
} catch (err) {
  console.error("ERROR FROM 'startFun.saveDummyLotteries(req,res)' Function : \n", err);
}
});

module.exports = router;
