var express = require('express');
var router = express.Router();
const moment = require('moment-timezone');
var startFun= require("../helper/startingHelper")


router.get('/check-time', (req, res) => {

  try {
    const normalTimeFromBackend = new Date();
    const bhutanTime = moment().tz('Asia/Dubai');
    const indianTime = moment().tz('Asia/Dubai');
    const dubaiTime = moment().tz('Asia/Dubai');
    const utcTime = moment().utc();

    const timeObj = {
      normalTimeFromBackend,
      bhutanTime: bhutanTime.format(),
      indianTime: indianTime.format(),
      dubaiTime: dubaiTime.format(),
      utcTime: utcTime.format()
    }
    res.render('checkTime', { timeObj })
  } catch (err) {
    console.error("Error in /check-time route:", err);
  }

})

router.get('/add-dummy-lottery',async (req, res)=>{
  await startFun.saveDummyLotteries(req, res)
})

module.exports = router;
