var express = require('express');
var router = express.Router();
var startFun = require("../helper/startingHelper")
var indexFun = require("../helper/indexHelper")




router.get('/time', async function (req, res, next) {
  res.json({ date: new Date() })
});

/* GET home page. */
router.get('/', async function (req, res, next) {
  await indexFun.getLotteries(req, res)
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

router.get('/admin-login', function(req, res, next) {
    res.render('pages/Auth/admin-login', )
});

router.get('/api/ticket-charges',async function(req, res, next) {
   await indexFun.getAllCharges(req, res);
});

router.post('/api/ticket-charges',async function(req, res, next) {
   await indexFun.createCharge(req, res)
});
router.put('/api/ticket-charges/:chargeId',async function(req, res, next) {
   await indexFun.updateCharge(req, res)
});

router.delete('/api/ticket-charges/:chargeId',async function(req, res, next) {
   await indexFun.deleteCharge(req, res)
});

router.get('/booking', async function (req, res, next){
  res.render('pages/lottery-booking')
})

// router.get('/api/lotteries', async function (req, res, next){
//   res.status(200).json(
//     {
//   "success": true,
//   "lotteries": [
//     {
//     _id: ObjectId("68ca601f35fa3310739da189"),
//     name: 'wed Choice Weekly Lottery',
//     name2: '12th draw',
//     drawNumber: 12,
//     drawDate: ISODate("2025-09-17T05:00:00.000Z"),
//     prizes: [
//       {
//         rank: 1,
//         amount: 100000,
//         _id: ObjectId("68ca601f35fa3310739da18a")
//       },
//       {
//         rank: 2,
//         amount: 50000,
//         _id: ObjectId("68ca601f35fa3310739da18b")
//       },
//       {
//         rank: 3,
//         amount: 10000,
//         _id: ObjectId("68ca601f35fa3310739da18c")
//       },
//       {
//         rank: 4,
//         amount: 1000,
//         _id: ObjectId("68ca601f35fa3310739da18d")
//       },
//       {
//         rank: 5,
//         amount: 100,
//         _id: ObjectId("68ca601f35fa3310739da18e")
//       }
//     ],
//     winners: [
//       {
//         _id: ObjectId("68ca601f35fa3310739da18f"),
//         resultTime: ISODate("2025-09-17T07:00:00.000Z"),
//         winNumbers: [
//           {
//             prizeRank: 1,
//             ticketNumber: '56787',
//             resultStatus: true,
//             _id: ObjectId("68ca601f35fa3310739da190")
//           },
//           {
//             prizeRank: 2,
//             ticketNumber: '6787',
//             resultStatus: true,
//             _id: ObjectId("68ca601f35fa3310739da191")
//           },
//           {
//             prizeRank: 3,
//             ticketNumber: '000',
//             resultStatus: false,
//             _id: ObjectId("68ca601f35fa3310739da192")
//           },
//           {
//             prizeRank: 4,
//             ticketNumber: '00',
//             resultStatus: false,
//             _id: ObjectId("68ca601f35fa3310739da193")
//           },
//           {
//             prizeRank: 5,
//             ticketNumber: '00000',
//             resultStatus: false,
//             _id: ObjectId("68ca601f35fa3310739da194")
//           }
//         ]
//       }
//     ],
//     createdAt: ISODate("2025-09-17T07:15:43.298Z"),
//     updatedAt: ISODate("2025-09-17T07:15:43.298Z"),
//     __v: 0
//   },
//   ]
// }
//   )
// })

router.get('/api/lotteries', async function (req, res, next) {
  res.status(200).json(
    {
      "success": true,
      "lotteries": [
        {
          _id: "68ca601f35fa3310739da189",
          name: 'wed Choice Weekly Lottery',
          name2: '12th draw',
          drawNumber: 12,
          drawDate: "2025-09-17T05:00:00.000Z",
          prizes: [
            {
              rank: 1,
              amount: 100000,
              _id: "68ca601f35fa3310739da18a"
            },
            {
              rank: 2,
              amount: 50000,
              _id: "68ca601f35fa3310739da18b"
            },
            {
              rank: 3,
              amount: 10000,
              _id: "68ca601f35fa3310739da18c"
            },
            {
              rank: 4,
              amount: 1000,
              _id: "68ca601f35fa3310739da18d"
            },
            {
              rank: 5,
              amount: 100,
              _id: "68ca601f35fa3310739da18e"
            }
          ],
          winners: [
            {
              _id: "68ca601f35fa3310739da18f",
              resultTime: "2025-09-17T07:00:00.000Z",
              winNumbers: [
                {
                  prizeRank: 1,
                  ticketNumber: '56787',
                  resultStatus: true,
                  _id: "68ca601f35fa3310739da190"
                },
                {
                  prizeRank: 2,
                  ticketNumber: '6787',
                  resultStatus: true,
                  _id: "68ca601f35fa3310739da191"
                },
                {
                  prizeRank: 3,
                  ticketNumber: '000',
                  resultStatus: false,
                  _id: "68ca601f35fa3310739da192"
                },
                {
                  prizeRank: 4,
                  ticketNumber: '00',
                  resultStatus: false,
                  _id: "68ca601f35fa3310739da193"
                },
                {
                  prizeRank: 5,
                  ticketNumber: '00000',
                  resultStatus: false,
                  _id: "68ca601f35fa3310739da194"
                }
              ]
            },
            {
              _id: "68ca601f35fa3310739da18f",
              resultTime: "2025-09-17T07:00:00.000Z",
              winNumbers: [
                {
                  prizeRank: 1,
                  ticketNumber: '56787',
                  resultStatus: true,
                  _id: "68ca601f35fa3310739da190"
                },
                {
                  prizeRank: 2,
                  ticketNumber: '6787',
                  resultStatus: true,
                  _id: "68ca601f35fa3310739da191"
                },
                {
                  prizeRank: 3,
                  ticketNumber: '000',
                  resultStatus: false,
                  _id: "68ca601f35fa3310739da192"
                },
                {
                  prizeRank: 4,
                  ticketNumber: '00',
                  resultStatus: false,
                  _id: "68ca601f35fa3310739da193"
                },
                {
                  prizeRank: 5,
                  ticketNumber: '00000',
                  resultStatus: false,
                  _id: "68ca601f35fa3310739da194"
                }
              ]
            }
          ],
          createdAt: "2025-09-17T07:15:43.298Z",
          updatedAt: "2025-09-17T07:15:43.298Z",
          __v: 0
        },
        {
          _id: "68ca601f35fa3310739da34189",
          name: 'wed Choice Weekly Lottery2',
          name2: '12th draw',
          drawNumber: 12,
          drawDate: "2025-09-17T05:00:00.000Z",
          prizes: [
            {
              rank: 1,
              amount: 100000,
              _id: "68ca601f35fa3310739da18a"
            },
            {
              rank: 2,
              amount: 50000,
              _id: "68ca601f35fa3310739da18b"
            },
            {
              rank: 3,
              amount: 10000,
              _id: "68ca601f35fa3310739da18c"
            },
            {
              rank: 4,
              amount: 1000,
              _id: "68ca601f35fa3310739da18d"
            },
            {
              rank: 5,
              amount: 100,
              _id: "68ca601f35fa3310739da18e"
            }
          ],
          winners: [
            {
              _id: "68ca601f35fa3310739da18f",
              resultTime: "2025-09-17T07:00:00.000Z",
              winNumbers: [
                {
                  prizeRank: 1,
                  ticketNumber: '56787',
                  resultStatus: true,
                  _id: "68ca601f35fa3310739da190"
                },
                {
                  prizeRank: 2,
                  ticketNumber: '6787',
                  resultStatus: true,
                  _id: "68ca601f35fa3310739da191"
                },
                {
                  prizeRank: 3,
                  ticketNumber: '000',
                  resultStatus: false,
                  _id: "68ca601f35fa3310739da192"
                },
                {
                  prizeRank: 4,
                  ticketNumber: '00',
                  resultStatus: false,
                  _id: "68ca601f35fa3310739da193"
                },
                {
                  prizeRank: 5,
                  ticketNumber: '00000',
                  resultStatus: false,
                  _id: "68ca601f35fa3310739da194"
                }
              ]
            },
            {
              _id: "68ca601f35fa336510739da18f",
              resultTime: "2025-09-17T07:00:00.000Z",
              winNumbers: [
                {
                  prizeRank: 1,
                  ticketNumber: '56787',
                  resultStatus: true,
                  _id: "68ca601f35fa36310739da190"
                },
                {
                  prizeRank: 2,
                  ticketNumber: '6787',
                  resultStatus: true,
                  _id: "68ca601f35fa33610739da191"
                },
                {
                  prizeRank: 3,
                  ticketNumber: '000',
                  resultStatus: false,
                  _id: "68ca601f35fa33610739da192"
                },
                {
                  prizeRank: 4,
                  ticketNumber: '00',
                  resultStatus: false,
                  _id: "68ca601f35fa63310739da193"
                },
                {
                  prizeRank: 5,
                  ticketNumber: '00000',
                  resultStatus: false,
                  _id: "68ca601f35fa33106739da194"
                }
              ]
            }
          ],
          createdAt: "2025-09-17T07:15:43.298Z",
          updatedAt: "2025-09-17T07:15:43.298Z",
          __v: 0
        },
      ]
    }
  )
})

router.get('/api/booking/ticket-charges',async function(req, res, next) {
   res.status(200).json({
  "success": true,
  "ticketCharges": [
    {
      "_id": "charge_id1",
      "ticketType": 3,
      "chargeAmount": 10.00
    },
    {
      "_id": "charge_id2",
      "ticketType": 5,
      "chargeAmount": 50.00
    },
    {
      "_id": "charge_id3",
      "ticketType": 1,
      "chargeAmount": 10.00
    }
  ]
})
});

module.exports = router;
