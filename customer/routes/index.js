var express = require('express');
var router = express.Router();
var startFun = require("../helper/startingHelper")
var indexFun = require("../helper/indexHelper")



router.get('/time', async function (req, res, next) {
  res.json({ date: new Date() })
});

/* GET home page. */
router.get('/', async function (req, res, next) {
 let recentLotteries = await indexFun.getRecentLotteries(req, res);
});

/* GET home page. */
router.get('/results', async function (req, res, next) {
  await indexFun.getLotteries(req, res)
});
router.post('/api/refresh-results',async function(req, res, next) {
  await indexFun.refreshResults(req,res)
});
router.post('/api/get-past-lottories', async function (req, res, next) {
  await indexFun.getPastLotteries(req, res)
});

router.get('/create-dummy-lottories', async function (req, res, next) {
  try {
    let savedLotteries = await startFun.saveDummyLotteries(req, res);
  } catch (err) {
    console.error("ERROR FROM 'startFun.saveDummyLotteries(req,res)' Function : \n", err);
  }
});

router.get('/api/lottery-autocomplete', async function (req, res, next) {
  let response = {
    "success": true,
    "data": {
      "suggestedName": "",
      "nextDrawNumber": '',
      "suggestedDate": "",
      "dayName": "Tuesday",
      "lastLottery": {
        "name": "",
        "drawNumber": 6,
        "drawDate": ""
      }
    }
  }
  res.json(response);
})

router.post('/api/lottery', async function (req, res, next) {
  
  await indexFun.createLottery(req, res)
 
})

router.put('/api/lottery/:id', async function (req, res, next) {
  
  await indexFun.updateLottery(req, res)
 
})
router.get('/api/lottery/:id', async function (req, res, next) {
  await indexFun.getLottery(req, res)
})
router.delete('/api/lottery/:id', async function (req, res, next) {
  await indexFun.deleteLottery(req, res)
})

router.get('/receipt/:ticketNumber', async (req, res)=>{
 await indexFun.getReceiptPage(req, res)
})

router.get('/admin-login', function(req, res, next) {
    res.render('pages/Auth/admin-login', )
});


module.exports = router;
