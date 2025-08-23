var express = require('express');
var router = express.Router();
const moment = require('moment-timezone');

router.get('/check-time', (req, res) => {

  try {
    const normalTimeFromBackend = new Date();
    const bhutanTime = moment().tz('Asia/Thimphu');
    const indianTime = moment().tz('Asia/Kolkata');
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

module.exports = router;
