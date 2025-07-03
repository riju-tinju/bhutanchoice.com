var express = require('express');
var router = express.Router();
var startFun= require("../helper/startingHelper")
var indexFun= require("../helper/indexHelper")

/* GET home page. */
router.get('/',async function(req, res, next) {
  await indexFun.getLotteries(req,res)
});

router.get('/create-dummy-lottories',async function(req, res, next) {
  try{
   let savedLottories=await startFun.saveDummyLotteries(req,res)
   if(!savedLottories)
    res.send('an error occured')
   res.json({savedLottories})
  }catch(err){
    console.log(err)
   res.send('an error occured')
  }
});

module.exports = router;
