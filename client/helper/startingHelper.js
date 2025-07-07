const Lottery = require('../model/lotterySchema'); // Your model


const startFun = {
    saveDummyLotteries: async (req, res) => {
    //    const lotteries =
    //         [
    //             {
    //                 "name": "Sunday Choice Weekly Lottery (SUC-1st Draw)",
    //                 "drawDate": "2025-06-01T09:00:00Z",
    //                 "prizes": [
    //                     { "rank": 1, "amount": 100000 },
    //                     { "rank": 2, "amount": 10000 },
    //                     { "rank": 3, "amount": 5000 },
    //                     { "rank": 4, "amount": 1000 },
    //                     { "rank": 5, "amount": 100 }
    //                 ],
    //                 "winners": [
    //                     { "ticketNumber": "KL 32498", "prizeRank": 1 },
    //                     { "ticketNumber": "7410", "prizeRank": 2 },
    //                     { "ticketNumber": "315", "prizeRank": 3 },
    //                     { "ticketNumber": "253", "prizeRank": 4 },
    //                     { "ticketNumber": "064", "prizeRank": 5 }
    //                 ]
    //             },
    //             {
    //                 "name": "Monday Choice Weekly Lottery (MOC-1st Draw)",
    //                 "drawDate": "2025-06-02T09:00:00Z",
    //                 "prizes": [
    //                     { "rank": 1, "amount": 100000 },
    //                     { "rank": 2, "amount": 10000 },
    //                     { "rank": 3, "amount": 5000 },
    //                     { "rank": 4, "amount": 1000 },
    //                     { "rank": 5, "amount": 100 }
    //                 ],
    //                 "winners": [
    //                     { "ticketNumber": "MH 81245", "prizeRank": 1 },
    //                     { "ticketNumber": "3974", "prizeRank": 2 },
    //                     { "ticketNumber": "741", "prizeRank": 3 },
    //                     { "ticketNumber": "305", "prizeRank": 4 },
    //                     { "ticketNumber": "181", "prizeRank": 5 }
    //                 ]
    //             },
    //             {
    //                 "name": "Tuesday Choice Weekly Lottery (TUC-1st Draw)",
    //                 "drawDate": "2025-06-03T09:00:00Z",
    //                 "prizes": [
    //                     { "rank": 1, "amount": 100000 },
    //                     { "rank": 2, "amount": 10000 },
    //                     { "rank": 3, "amount": 5000 },
    //                     { "rank": 4, "amount": 1000 },
    //                     { "rank": 5, "amount": 100 }
    //                 ],
    //                 "winners": [
    //                     { "ticketNumber": "DL 21940", "prizeRank": 1 },
    //                     { "ticketNumber": "5667", "prizeRank": 2 },
    //                     { "ticketNumber": "269", "prizeRank": 3 },
    //                     { "ticketNumber": "679", "prizeRank": 4 },
    //                     { "ticketNumber": "056", "prizeRank": 5 }
    //                 ]
    //             },
    //             {
    //                 "name": "Wednesday Choice Weekly Lottery (WEC-1st Draw)",
    //                 "drawDate": "2025-06-04T09:00:00Z",
    //                 "prizes": [
    //                     { "rank": 1, "amount": 100000 },
    //                     { "rank": 2, "amount": 10000 },
    //                     { "rank": 3, "amount": 5000 },
    //                     { "rank": 4, "amount": 1000 },
    //                     { "rank": 5, "amount": 100 }
    //                 ],
    //                 "winners": [
    //                     { "ticketNumber": "GJ 50093", "prizeRank": 1 },
    //                     { "ticketNumber": "2180", "prizeRank": 2 },
    //                     { "ticketNumber": "892", "prizeRank": 3 },
    //                     { "ticketNumber": "304", "prizeRank": 4 },
    //                     { "ticketNumber": "009", "prizeRank": 5 }
    //                 ]
    //             },
    //             {
    //                 "name": "Thursday Choice Weekly Lottery (THC-1st Draw)",
    //                 "drawDate": "2025-06-05T09:00:00Z",
    //                 "prizes": [
    //                     { "rank": 1, "amount": 100000 },
    //                     { "rank": 2, "amount": 10000 },
    //                     { "rank": 3, "amount": 5000 },
    //                     { "rank": 4, "amount": 1000 },
    //                     { "rank": 5, "amount": 100 }
    //                 ],
    //                 "winners": [
    //                     { "ticketNumber": "TN 13429", "prizeRank": 1 },
    //                     { "ticketNumber": "9755", "prizeRank": 2 },
    //                     { "ticketNumber": "354", "prizeRank": 3 },
    //                     { "ticketNumber": "161", "prizeRank": 4 },
    //                     { "ticketNumber": "148", "prizeRank": 5 }
    //                 ]
    //             },
    //             {
    //                 "name": "Friday Choice Weekly Lottery (FRC-1st Draw)",
    //                 "drawDate": "2025-06-06T09:00:00Z",
    //                 "prizes": [
    //                     { "rank": 1, "amount": 100000 },
    //                     { "rank": 2, "amount": 10000 },
    //                     { "rank": 3, "amount": 5000 },
    //                     { "rank": 4, "amount": 1000 },
    //                     { "rank": 5, "amount": 100 }
    //                 ],
    //                 "winners": [
    //                     { "ticketNumber": "MH 91586", "prizeRank": 1 },
    //                     { "ticketNumber": "8523", "prizeRank": 2 },
    //                     { "ticketNumber": "367", "prizeRank": 3 },
    //                     { "ticketNumber": "055", "prizeRank": 4 },
    //                     { "ticketNumber": "083", "prizeRank": 5 }
    //                 ]
    //             },
    //             {
    //                 "name": "Saturday Choice Weekly Lottery (SAC-1st Draw)",
    //                 "drawDate": "2025-06-07T09:00:00Z",
    //                 "prizes": [
    //                     { "rank": 1, "amount": 100000 },
    //                     { "rank": 2, "amount": 10000 },
    //                     { "rank": 3, "amount": 5000 },
    //                     { "rank": 4, "amount": 1000 },
    //                     { "rank": 5, "amount": 100 }
    //                 ],
    //                 "winners": [
    //                     { "ticketNumber": "KL 38065", "prizeRank": 1 },
    //                     { "ticketNumber": "5931", "prizeRank": 2 },
    //                     { "ticketNumber": "112", "prizeRank": 3 },
    //                     { "ticketNumber": "179", "prizeRank": 4 },
    //                     { "ticketNumber": "071", "prizeRank": 5 }
    //                 ]
    //             },
    //             {
    //                 "name": "Sunday Choice Weekly Lottery (SUC-2nd Draw)",
    //                 "drawDate": "2025-06-08T09:00:00Z",
    //                 "prizes": [
    //                     { "rank": 1, "amount": 100000 },
    //                     { "rank": 2, "amount": 10000 },
    //                     { "rank": 3, "amount": 5000 },
    //                     { "rank": 4, "amount": 1000 },
    //                     { "rank": 5, "amount": 100 }
    //                 ],
    //                 "winners": [
    //                     { "ticketNumber": "DL 49220", "prizeRank": 1 },
    //                     { "ticketNumber": "3617", "prizeRank": 2 },
    //                     { "ticketNumber": "663", "prizeRank": 3 },
    //                     { "ticketNumber": "847", "prizeRank": 4 },
    //                     { "ticketNumber": "006", "prizeRank": 5 }
    //                 ]
    //             },
    //             {
    //                 "name": "Monday Choice Weekly Lottery (MOC-2nd Draw)",
    //                 "drawDate": "2025-06-09T09:00:00Z",
    //                 "prizes": [
    //                     { "rank": 1, "amount": 100000 },
    //                     { "rank": 2, "amount": 10000 },
    //                     { "rank": 3, "amount": 5000 },
    //                     { "rank": 4, "amount": 1000 },
    //                     { "rank": 5, "amount": 100 }
    //                 ],
    //                 "winners": [
    //                     { "ticketNumber": "GJ 78530", "prizeRank": 1 },
    //                     { "ticketNumber": "9382", "prizeRank": 2 },
    //                     { "ticketNumber": "357", "prizeRank": 3 },
    //                     { "ticketNumber": "423", "prizeRank": 4 },
    //                     { "ticketNumber": "030", "prizeRank": 5 }
    //                 ]
    //             },
    //             {
    //                 "name": "Tuesday Choice Weekly Lottery (TUC-2nd Draw)",
    //                 "drawDate": "2025-06-10T09:00:00Z",
    //                 "prizes": [
    //                     { "rank": 1, "amount": 100000 },
    //                     { "rank": 2, "amount": 10000 },
    //                     { "rank": 3, "amount": 5000 },
    //                     { "rank": 4, "amount": 1000 },
    //                     { "rank": 5, "amount": 100 }
    //                 ],
    //                 "winners": [
    //                     { "ticketNumber": "TN 62436", "prizeRank": 1 },
    //                     { "ticketNumber": "2910", "prizeRank": 2 },
    //                     { "ticketNumber": "899", "prizeRank": 3 },
    //                     { "ticketNumber": "010", "prizeRank": 4 },
    //                     { "ticketNumber": "058", "prizeRank": 5 }
    //                 ]
    //             },
    //             {
    //                 'name': 'Thursday Choice Weekly Lottery (THC-2nd Draw)',
    //                 'drawDate': '2025-06-12T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'TN 38813', 'prizeRank': 1 },
    //                 { 'ticketNumber': '9219', 'prizeRank': 2 },
    //                 { 'ticketNumber': '375', 'prizeRank': 3 },
    //                 { 'ticketNumber': '849', 'prizeRank': 4 },
    //                 { 'ticketNumber': '145', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Friday Choice Weekly Lottery (FRC-2nd Draw)',
    //                 'drawDate': '2025-06-13T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'MH 26637', 'prizeRank': 1 },
    //                 { 'ticketNumber': '8289', 'prizeRank': 2 },
    //                 { 'ticketNumber': '977', 'prizeRank': 3 },
    //                 { 'ticketNumber': '808', 'prizeRank': 4 },
    //                 { 'ticketNumber': '231', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Saturday Choice Weekly Lottery (SAC-2nd Draw)',
    //                 'drawDate': '2025-06-14T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'TN 79853', 'prizeRank': 1 },
    //                 { 'ticketNumber': '6317', 'prizeRank': 2 },
    //                 { 'ticketNumber': '695', 'prizeRank': 3 },
    //                 { 'ticketNumber': '682', 'prizeRank': 4 },
    //                 { 'ticketNumber': '060', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Sunday Choice Weekly Lottery (SUC-3rd Draw)',
    //                 'drawDate': '2025-06-15T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'GJ 29151', 'prizeRank': 1 },
    //                 { 'ticketNumber': '3524', 'prizeRank': 2 },
    //                 { 'ticketNumber': '956', 'prizeRank': 3 },
    //                 { 'ticketNumber': '658', 'prizeRank': 4 },
    //                 { 'ticketNumber': '376', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Monday Choice Weekly Lottery (MOC-3rd Draw)',
    //                 'drawDate': '2025-06-16T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'GJ 51931', 'prizeRank': 1 },
    //                 { 'ticketNumber': '5327', 'prizeRank': 2 },
    //                 { 'ticketNumber': '994', 'prizeRank': 3 },
    //                 { 'ticketNumber': '790', 'prizeRank': 4 },
    //                 { 'ticketNumber': '966', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Tuesday Choice Weekly Lottery (TUC-3rd Draw)',
    //                 'drawDate': '2025-06-17T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'KL 32332', 'prizeRank': 1 },
    //                 { 'ticketNumber': '1897', 'prizeRank': 2 },
    //                 { 'ticketNumber': '646', 'prizeRank': 3 },
    //                 { 'ticketNumber': '277', 'prizeRank': 4 },
    //                 { 'ticketNumber': '767', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Wednesday Choice Weekly Lottery (WEC-3rd Draw)',
    //                 'drawDate': '2025-06-18T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'MH 40445', 'prizeRank': 1 },
    //                 { 'ticketNumber': '4558', 'prizeRank': 2 },
    //                 { 'ticketNumber': '984', 'prizeRank': 3 },
    //                 { 'ticketNumber': '697', 'prizeRank': 4 },
    //                 { 'ticketNumber': '439', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Thursday Choice Weekly Lottery (THC-3rd Draw)',
    //                 'drawDate': '2025-06-19T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'TN 60571', 'prizeRank': 1 },
    //                 { 'ticketNumber': '9264', 'prizeRank': 2 },
    //                 { 'ticketNumber': '417', 'prizeRank': 3 },
    //                 { 'ticketNumber': '523', 'prizeRank': 4 },
    //                 { 'ticketNumber': '906', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Friday Choice Weekly Lottery (FRC-3rd Draw)',
    //                 'drawDate': '2025-06-20T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'TN 59597', 'prizeRank': 1 },
    //                 { 'ticketNumber': '1139', 'prizeRank': 2 },
    //                 { 'ticketNumber': '468', 'prizeRank': 3 },
    //                 { 'ticketNumber': '754', 'prizeRank': 4 },
    //                 { 'ticketNumber': '615', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Saturday Choice Weekly Lottery (SAC-3rd Draw)',
    //                 'drawDate': '2025-06-21T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'MH 40354', 'prizeRank': 1 },
    //                 { 'ticketNumber': '9596', 'prizeRank': 2 },
    //                 { 'ticketNumber': '729', 'prizeRank': 3 },
    //                 { 'ticketNumber': '630', 'prizeRank': 4 },
    //                 { 'ticketNumber': '697', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Sunday Choice Weekly Lottery (SUC-4th Draw)',
    //                 'drawDate': '2025-06-22T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'TN 69458', 'prizeRank': 1 },
    //                 { 'ticketNumber': '1571', 'prizeRank': 2 },
    //                 { 'ticketNumber': '584', 'prizeRank': 3 },
    //                 { 'ticketNumber': '471', 'prizeRank': 4 },
    //                 { 'ticketNumber': '682', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Monday Choice Weekly Lottery (MOC-4th Draw)',
    //                 'drawDate': '2025-06-23T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'TN 63669', 'prizeRank': 1 },
    //                 { 'ticketNumber': '4158', 'prizeRank': 2 },
    //                 { 'ticketNumber': '973', 'prizeRank': 3 },
    //                 { 'ticketNumber': '302', 'prizeRank': 4 },
    //                 { 'ticketNumber': '210', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Tuesday Choice Weekly Lottery (TUC-4th Draw)',
    //                 'drawDate': '2025-06-24T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'GJ 38176', 'prizeRank': 1 },
    //                 { 'ticketNumber': '9096', 'prizeRank': 2 },
    //                 { 'ticketNumber': '892', 'prizeRank': 3 },
    //                 { 'ticketNumber': '183', 'prizeRank': 4 },
    //                 { 'ticketNumber': '593', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Wednesday Choice Weekly Lottery (WEC-4th Draw)',
    //                 'drawDate': '2025-06-25T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'MH 59985', 'prizeRank': 1 },
    //                 { 'ticketNumber': '5175', 'prizeRank': 2 },
    //                 { 'ticketNumber': '339', 'prizeRank': 3 },
    //                 { 'ticketNumber': '141', 'prizeRank': 4 },
    //                 { 'ticketNumber': '681', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Thursday Choice Weekly Lottery (THC-4th Draw)',
    //                 'drawDate': '2025-06-26T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'KL 18631', 'prizeRank': 1 },
    //                 { 'ticketNumber': '7651', 'prizeRank': 2 },
    //                 { 'ticketNumber': '989', 'prizeRank': 3 },
    //                 { 'ticketNumber': '269', 'prizeRank': 4 },
    //                 { 'ticketNumber': '223', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Friday Choice Weekly Lottery (FRC-4th Draw)',
    //                 'drawDate': '2025-06-27T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'DL 93421', 'prizeRank': 1 },
    //                 { 'ticketNumber': '6171', 'prizeRank': 2 },
    //                 { 'ticketNumber': '175', 'prizeRank': 3 },
    //                 { 'ticketNumber': '102', 'prizeRank': 4 },
    //                 { 'ticketNumber': '519', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Saturday Choice Weekly Lottery (SAC-4th Draw)',
    //                 'drawDate': '2025-06-28T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'GJ 59147', 'prizeRank': 1 },
    //                 { 'ticketNumber': '6557', 'prizeRank': 2 },
    //                 { 'ticketNumber': '373', 'prizeRank': 3 },
    //                 { 'ticketNumber': '301', 'prizeRank': 4 },
    //                 { 'ticketNumber': '768', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Sunday Choice Weekly Lottery (SUC-5th Draw)',
    //                 'drawDate': '2025-06-29T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'TN 36042', 'prizeRank': 1 },
    //                 { 'ticketNumber': '6655', 'prizeRank': 2 },
    //                 { 'ticketNumber': '508', 'prizeRank': 3 },
    //                 { 'ticketNumber': '509', 'prizeRank': 4 },
    //                 { 'ticketNumber': '365', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Monday Choice Weekly Lottery (MOC-5th Draw)',
    //                 'drawDate': '2025-06-30T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'KL 68678', 'prizeRank': 1 },
    //                 { 'ticketNumber': '3102', 'prizeRank': 2 },
    //                 { 'ticketNumber': '617', 'prizeRank': 3 },
    //                 { 'ticketNumber': '304', 'prizeRank': 4 },
    //                 { 'ticketNumber': '347', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Tuesday Choice Weekly Lottery (TUC-5th Draw)',
    //                 'drawDate': '2025-07-01T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'DL 44895', 'prizeRank': 1 },
    //                 { 'ticketNumber': '4021', 'prizeRank': 2 },
    //                 { 'ticketNumber': '676', 'prizeRank': 3 },
    //                 { 'ticketNumber': '561', 'prizeRank': 4 },
    //                 { 'ticketNumber': '846', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Wednesday Choice Weekly Lottery (WEC-5th Draw)',
    //                 'drawDate': '2025-07-02T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'TN 57869', 'prizeRank': 1 },
    //                 { 'ticketNumber': '3721', 'prizeRank': 2 },
    //                 { 'ticketNumber': '899', 'prizeRank': 3 },
    //                 { 'ticketNumber': '082', 'prizeRank': 4 },
    //                 { 'ticketNumber': '419', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Thursday Choice Weekly Lottery (THC-5th Draw)',
    //                 'drawDate': '2025-07-03T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'GJ 29042', 'prizeRank': 1 },
    //                 { 'ticketNumber': '1652', 'prizeRank': 2 },
    //                 { 'ticketNumber': '147', 'prizeRank': 3 },
    //                 { 'ticketNumber': '080', 'prizeRank': 4 },
    //                 { 'ticketNumber': '557', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Friday Choice Weekly Lottery (FRC-5th Draw)',
    //                 'drawDate': '2025-07-04T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'MH 44070', 'prizeRank': 1 },
    //                 { 'ticketNumber': '1485', 'prizeRank': 2 },
    //                 { 'ticketNumber': '992', 'prizeRank': 3 },
    //                 { 'ticketNumber': '937', 'prizeRank': 4 },
    //                 { 'ticketNumber': '848', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Saturday Choice Weekly Lottery (SAC-5th Draw)',
    //                 'drawDate': '2025-07-05T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'TN 93818', 'prizeRank': 1 },
    //                 { 'ticketNumber': '5432', 'prizeRank': 2 },
    //                 { 'ticketNumber': '994', 'prizeRank': 3 },
    //                 { 'ticketNumber': '945', 'prizeRank': 4 },
    //                 { 'ticketNumber': '835', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Sunday Choice Weekly Lottery (SUC-6th Draw)',
    //                 'drawDate': '2025-07-06T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'MH 86416', 'prizeRank': 1 },
    //                 { 'ticketNumber': '2181', 'prizeRank': 2 },
    //                 { 'ticketNumber': '766', 'prizeRank': 3 },
    //                 { 'ticketNumber': '454', 'prizeRank': 4 },
    //                 { 'ticketNumber': '790', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Monday Choice Weekly Lottery (MOC-6th Draw)',
    //                 'drawDate': '2025-07-07T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'MH 31012', 'prizeRank': 1 },
    //                 { 'ticketNumber': '1997', 'prizeRank': 2 },
    //                 { 'ticketNumber': '946', 'prizeRank': 3 },
    //                 { 'ticketNumber': '380', 'prizeRank': 4 },
    //                 { 'ticketNumber': '886', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Tuesday Choice Weekly Lottery (TUC-6th Draw)',
    //                 'drawDate': '2025-07-08T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'DL 77180', 'prizeRank': 1 },
    //                 { 'ticketNumber': '1532', 'prizeRank': 2 },
    //                 { 'ticketNumber': '519', 'prizeRank': 3 },
    //                 { 'ticketNumber': '270', 'prizeRank': 4 },
    //                 { 'ticketNumber': '984', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Wednesday Choice Weekly Lottery (WEC-6th Draw)',
    //                 'drawDate': '2025-07-09T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'GJ 22105', 'prizeRank': 1 },
    //                 { 'ticketNumber': '1549', 'prizeRank': 2 },
    //                 { 'ticketNumber': '894', 'prizeRank': 3 },
    //                 { 'ticketNumber': '014', 'prizeRank': 4 },
    //                 { 'ticketNumber': '651', 'prizeRank': 5 }]
    //             },
    //             {
    //                 'name': 'Thursday Choice Weekly Lottery (THC-6th Draw)',
    //                 'drawDate': '2025-07-10T09:00:00Z',
    //                 'prizes': [{ 'rank': 1, 'amount': 100000 },
    //                 { 'rank': 2, 'amount': 10000 },
    //                 { 'rank': 3, 'amount': 5000 },
    //                 { 'rank': 4, 'amount': 1000 },
    //                 { 'rank': 5, 'amount': 100 }],
    //                 'winners': [{ 'ticketNumber': 'KL 52069', 'prizeRank': 1 },
    //                 { 'ticketNumber': '5161', 'prizeRank': 2 },
    //                 { 'ticketNumber': '269', 'prizeRank': 3 },
    //                 { 'ticketNumber': '600', 'prizeRank': 4 },
    //                 { 'ticketNumber': '064', 'prizeRank': 5 }]
    //             }
    //         ]
        const lotteries =
            [
                {
                    "name": "Sunday Choice Weekly Lottery (SUC-1st Draw)",
                    "drawDate": "2025-06-01T00:00:00",
                    "prizes": [
                        { "rank": 1, "amount": 100000 },
                        { "rank": 2, "amount": 10000 },
                        { "rank": 3, "amount": 5000 },
                        { "rank": 4, "amount": 1000 },
                        { "rank": 5, "amount": 100 }
                    ],
                    "winners": [
                        { "ticketNumber": "KL 32498", "prizeRank": 1 },
                        { "ticketNumber": "7410", "prizeRank": 2 },
                        { "ticketNumber": "315", "prizeRank": 3 },
                        { "ticketNumber": "253", "prizeRank": 4 },
                        { "ticketNumber": "064", "prizeRank": 5 }
                    ]
                },
                {
                    "name": "Monday Choice Weekly Lottery (MOC-1st Draw)",
                    "drawDate": "2025-06-02T00:00:00",
                    "prizes": [
                        { "rank": 1, "amount": 100000 },
                        { "rank": 2, "amount": 10000 },
                        { "rank": 3, "amount": 5000 },
                        { "rank": 4, "amount": 1000 },
                        { "rank": 5, "amount": 100 }
                    ],
                    "winners": [
                        { "ticketNumber": "MH 81245", "prizeRank": 1 },
                        { "ticketNumber": "3974", "prizeRank": 2 },
                        { "ticketNumber": "741", "prizeRank": 3 },
                        { "ticketNumber": "305", "prizeRank": 4 },
                        { "ticketNumber": "181", "prizeRank": 5 }
                    ]
                },
                {
                    "name": "Tuesday Choice Weekly Lottery (TUC-1st Draw)",
                    "drawDate": "2025-06-03T00:00:00",
                    "prizes": [
                        { "rank": 1, "amount": 100000 },
                        { "rank": 2, "amount": 10000 },
                        { "rank": 3, "amount": 5000 },
                        { "rank": 4, "amount": 1000 },
                        { "rank": 5, "amount": 100 }
                    ],
                    "winners": [
                        { "ticketNumber": "DL 21940", "prizeRank": 1 },
                        { "ticketNumber": "5667", "prizeRank": 2 },
                        { "ticketNumber": "269", "prizeRank": 3 },
                        { "ticketNumber": "679", "prizeRank": 4 },
                        { "ticketNumber": "056", "prizeRank": 5 }
                    ]
                },
                {
                    "name": "Wednesday Choice Weekly Lottery (WEC-1st Draw)",
                    "drawDate": "2025-06-04T00:00:00",
                    "prizes": [
                        { "rank": 1, "amount": 100000 },
                        { "rank": 2, "amount": 10000 },
                        { "rank": 3, "amount": 5000 },
                        { "rank": 4, "amount": 1000 },
                        { "rank": 5, "amount": 100 }
                    ],
                    "winners": [
                        { "ticketNumber": "GJ 50093", "prizeRank": 1 },
                        { "ticketNumber": "2180", "prizeRank": 2 },
                        { "ticketNumber": "892", "prizeRank": 3 },
                        { "ticketNumber": "304", "prizeRank": 4 },
                        { "ticketNumber": "009", "prizeRank": 5 }
                    ]
                },
                {
                    "name": "Thursday Choice Weekly Lottery (THC-1st Draw)",
                    "drawDate": "2025-06-05T00:00:00",
                    "prizes": [
                        { "rank": 1, "amount": 100000 },
                        { "rank": 2, "amount": 10000 },
                        { "rank": 3, "amount": 5000 },
                        { "rank": 4, "amount": 1000 },
                        { "rank": 5, "amount": 100 }
                    ],
                    "winners": [
                        { "ticketNumber": "TN 13429", "prizeRank": 1 },
                        { "ticketNumber": "9755", "prizeRank": 2 },
                        { "ticketNumber": "354", "prizeRank": 3 },
                        { "ticketNumber": "161", "prizeRank": 4 },
                        { "ticketNumber": "148", "prizeRank": 5 }
                    ]
                },
                {
                    "name": "Friday Choice Weekly Lottery (FRC-1st Draw)",
                    "drawDate": "2025-06-06T00:00:00",
                    "prizes": [
                        { "rank": 1, "amount": 100000 },
                        { "rank": 2, "amount": 10000 },
                        { "rank": 3, "amount": 5000 },
                        { "rank": 4, "amount": 1000 },
                        { "rank": 5, "amount": 100 }
                    ],
                    "winners": [
                        { "ticketNumber": "MH 91586", "prizeRank": 1 },
                        { "ticketNumber": "8523", "prizeRank": 2 },
                        { "ticketNumber": "367", "prizeRank": 3 },
                        { "ticketNumber": "055", "prizeRank": 4 },
                        { "ticketNumber": "083", "prizeRank": 5 }
                    ]
                },
                {
                    "name": "Saturday Choice Weekly Lottery (SAC-1st Draw)",
                    "drawDate": "2025-06-07T00:00:00",
                    "prizes": [
                        { "rank": 1, "amount": 100000 },
                        { "rank": 2, "amount": 10000 },
                        { "rank": 3, "amount": 5000 },
                        { "rank": 4, "amount": 1000 },
                        { "rank": 5, "amount": 100 }
                    ],
                    "winners": [
                        { "ticketNumber": "KL 38065", "prizeRank": 1 },
                        { "ticketNumber": "5931", "prizeRank": 2 },
                        { "ticketNumber": "112", "prizeRank": 3 },
                        { "ticketNumber": "179", "prizeRank": 4 },
                        { "ticketNumber": "071", "prizeRank": 5 }
                    ]
                },
                {
                    "name": "Sunday Choice Weekly Lottery (SUC-2nd Draw)",
                    "drawDate": "2025-06-08T00:00:00",
                    "prizes": [
                        { "rank": 1, "amount": 100000 },
                        { "rank": 2, "amount": 10000 },
                        { "rank": 3, "amount": 5000 },
                        { "rank": 4, "amount": 1000 },
                        { "rank": 5, "amount": 100 }
                    ],
                    "winners": [
                        { "ticketNumber": "DL 49220", "prizeRank": 1 },
                        { "ticketNumber": "3617", "prizeRank": 2 },
                        { "ticketNumber": "663", "prizeRank": 3 },
                        { "ticketNumber": "847", "prizeRank": 4 },
                        { "ticketNumber": "006", "prizeRank": 5 }
                    ]
                },
                {
                    "name": "Monday Choice Weekly Lottery (MOC-2nd Draw)",
                    "drawDate": "2025-06-09T00:00:00",
                    "prizes": [
                        { "rank": 1, "amount": 100000 },
                        { "rank": 2, "amount": 10000 },
                        { "rank": 3, "amount": 5000 },
                        { "rank": 4, "amount": 1000 },
                        { "rank": 5, "amount": 100 }
                    ],
                    "winners": [
                        { "ticketNumber": "GJ 78530", "prizeRank": 1 },
                        { "ticketNumber": "9382", "prizeRank": 2 },
                        { "ticketNumber": "357", "prizeRank": 3 },
                        { "ticketNumber": "423", "prizeRank": 4 },
                        { "ticketNumber": "030", "prizeRank": 5 }
                    ]
                },
                {
                    "name": "Tuesday Choice Weekly Lottery (TUC-2nd Draw)",
                    "drawDate": "2025-06-10T00:00:00",
                    "prizes": [
                        { "rank": 1, "amount": 100000 },
                        { "rank": 2, "amount": 10000 },
                        { "rank": 3, "amount": 5000 },
                        { "rank": 4, "amount": 1000 },
                        { "rank": 5, "amount": 100 }
                    ],
                    "winners": [
                        { "ticketNumber": "TN 62436", "prizeRank": 1 },
                        { "ticketNumber": "2910", "prizeRank": 2 },
                        { "ticketNumber": "899", "prizeRank": 3 },
                        { "ticketNumber": "010", "prizeRank": 4 },
                        { "ticketNumber": "058", "prizeRank": 5 }
                    ]
                },
                {
                    'name': 'Thursday Choice Weekly Lottery (THC-2nd Draw)',
                    'drawDate': '2025-06-12T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'TN 38813', 'prizeRank': 1 },
                    { 'ticketNumber': '9219', 'prizeRank': 2 },
                    { 'ticketNumber': '375', 'prizeRank': 3 },
                    { 'ticketNumber': '849', 'prizeRank': 4 },
                    { 'ticketNumber': '145', 'prizeRank': 5 }]
                },
                {
                    'name': 'Friday Choice Weekly Lottery (FRC-2nd Draw)',
                    'drawDate': '2025-06-13T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'MH 26637', 'prizeRank': 1 },
                    { 'ticketNumber': '8289', 'prizeRank': 2 },
                    { 'ticketNumber': '977', 'prizeRank': 3 },
                    { 'ticketNumber': '808', 'prizeRank': 4 },
                    { 'ticketNumber': '231', 'prizeRank': 5 }]
                },
                {
                    'name': 'Saturday Choice Weekly Lottery (SAC-2nd Draw)',
                    'drawDate': '2025-06-14T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'TN 79853', 'prizeRank': 1 },
                    { 'ticketNumber': '6317', 'prizeRank': 2 },
                    { 'ticketNumber': '695', 'prizeRank': 3 },
                    { 'ticketNumber': '682', 'prizeRank': 4 },
                    { 'ticketNumber': '060', 'prizeRank': 5 }]
                },
                {
                    'name': 'Sunday Choice Weekly Lottery (SUC-3rd Draw)',
                    'drawDate': '2025-06-15T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'GJ 29151', 'prizeRank': 1 },
                    { 'ticketNumber': '3524', 'prizeRank': 2 },
                    { 'ticketNumber': '956', 'prizeRank': 3 },
                    { 'ticketNumber': '658', 'prizeRank': 4 },
                    { 'ticketNumber': '376', 'prizeRank': 5 }]
                },
                {
                    'name': 'Monday Choice Weekly Lottery (MOC-3rd Draw)',
                    'drawDate': '2025-06-16T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'GJ 51931', 'prizeRank': 1 },
                    { 'ticketNumber': '5327', 'prizeRank': 2 },
                    { 'ticketNumber': '994', 'prizeRank': 3 },
                    { 'ticketNumber': '790', 'prizeRank': 4 },
                    { 'ticketNumber': '966', 'prizeRank': 5 }]
                },
                {
                    'name': 'Tuesday Choice Weekly Lottery (TUC-3rd Draw)',
                    'drawDate': '2025-06-17T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'KL 32332', 'prizeRank': 1 },
                    { 'ticketNumber': '1897', 'prizeRank': 2 },
                    { 'ticketNumber': '646', 'prizeRank': 3 },
                    { 'ticketNumber': '277', 'prizeRank': 4 },
                    { 'ticketNumber': '767', 'prizeRank': 5 }]
                },
                {
                    'name': 'Wednesday Choice Weekly Lottery (WEC-3rd Draw)',
                    'drawDate': '2025-06-18T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'MH 40445', 'prizeRank': 1 },
                    { 'ticketNumber': '4558', 'prizeRank': 2 },
                    { 'ticketNumber': '984', 'prizeRank': 3 },
                    { 'ticketNumber': '697', 'prizeRank': 4 },
                    { 'ticketNumber': '439', 'prizeRank': 5 }]
                },
                {
                    'name': 'Thursday Choice Weekly Lottery (THC-3rd Draw)',
                    'drawDate': '2025-06-19T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'TN 60571', 'prizeRank': 1 },
                    { 'ticketNumber': '9264', 'prizeRank': 2 },
                    { 'ticketNumber': '417', 'prizeRank': 3 },
                    { 'ticketNumber': '523', 'prizeRank': 4 },
                    { 'ticketNumber': '906', 'prizeRank': 5 }]
                },
                {
                    'name': 'Friday Choice Weekly Lottery (FRC-3rd Draw)',
                    'drawDate': '2025-06-20T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'TN 59597', 'prizeRank': 1 },
                    { 'ticketNumber': '1139', 'prizeRank': 2 },
                    { 'ticketNumber': '468', 'prizeRank': 3 },
                    { 'ticketNumber': '754', 'prizeRank': 4 },
                    { 'ticketNumber': '615', 'prizeRank': 5 }]
                },
                {
                    'name': 'Saturday Choice Weekly Lottery (SAC-3rd Draw)',
                    'drawDate': '2025-06-21T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'MH 40354', 'prizeRank': 1 },
                    { 'ticketNumber': '9596', 'prizeRank': 2 },
                    { 'ticketNumber': '729', 'prizeRank': 3 },
                    { 'ticketNumber': '630', 'prizeRank': 4 },
                    { 'ticketNumber': '697', 'prizeRank': 5 }]
                },
                {
                    'name': 'Sunday Choice Weekly Lottery (SUC-4th Draw)',
                    'drawDate': '2025-06-22T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'TN 69458', 'prizeRank': 1 },
                    { 'ticketNumber': '1571', 'prizeRank': 2 },
                    { 'ticketNumber': '584', 'prizeRank': 3 },
                    { 'ticketNumber': '471', 'prizeRank': 4 },
                    { 'ticketNumber': '682', 'prizeRank': 5 }]
                },
                {
                    'name': 'Monday Choice Weekly Lottery (MOC-4th Draw)',
                    'drawDate': '2025-06-23T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'TN 63669', 'prizeRank': 1 },
                    { 'ticketNumber': '4158', 'prizeRank': 2 },
                    { 'ticketNumber': '973', 'prizeRank': 3 },
                    { 'ticketNumber': '302', 'prizeRank': 4 },
                    { 'ticketNumber': '210', 'prizeRank': 5 }]
                },
                {
                    'name': 'Tuesday Choice Weekly Lottery (TUC-4th Draw)',
                    'drawDate': '2025-06-24T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'GJ 38176', 'prizeRank': 1 },
                    { 'ticketNumber': '9096', 'prizeRank': 2 },
                    { 'ticketNumber': '892', 'prizeRank': 3 },
                    { 'ticketNumber': '183', 'prizeRank': 4 },
                    { 'ticketNumber': '593', 'prizeRank': 5 }]
                },
                {
                    'name': 'Wednesday Choice Weekly Lottery (WEC-4th Draw)',
                    'drawDate': '2025-06-25T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'MH 59985', 'prizeRank': 1 },
                    { 'ticketNumber': '5175', 'prizeRank': 2 },
                    { 'ticketNumber': '339', 'prizeRank': 3 },
                    { 'ticketNumber': '141', 'prizeRank': 4 },
                    { 'ticketNumber': '681', 'prizeRank': 5 }]
                },
                {
                    'name': 'Thursday Choice Weekly Lottery (THC-4th Draw)',
                    'drawDate': '2025-06-26T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'KL 18631', 'prizeRank': 1 },
                    { 'ticketNumber': '7651', 'prizeRank': 2 },
                    { 'ticketNumber': '989', 'prizeRank': 3 },
                    { 'ticketNumber': '269', 'prizeRank': 4 },
                    { 'ticketNumber': '223', 'prizeRank': 5 }]
                },
                {
                    'name': 'Friday Choice Weekly Lottery (FRC-4th Draw)',
                    'drawDate': '2025-06-27T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'DL 93421', 'prizeRank': 1 },
                    { 'ticketNumber': '6171', 'prizeRank': 2 },
                    { 'ticketNumber': '175', 'prizeRank': 3 },
                    { 'ticketNumber': '102', 'prizeRank': 4 },
                    { 'ticketNumber': '519', 'prizeRank': 5 }]
                },
                {
                    'name': 'Saturday Choice Weekly Lottery (SAC-4th Draw)',
                    'drawDate': '2025-06-28T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'GJ 59147', 'prizeRank': 1 },
                    { 'ticketNumber': '6557', 'prizeRank': 2 },
                    { 'ticketNumber': '373', 'prizeRank': 3 },
                    { 'ticketNumber': '301', 'prizeRank': 4 },
                    { 'ticketNumber': '768', 'prizeRank': 5 }]
                },
                {
                    'name': 'Sunday Choice Weekly Lottery (SUC-5th Draw)',
                    'drawDate': '2025-06-29T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'TN 36042', 'prizeRank': 1 },
                    { 'ticketNumber': '6655', 'prizeRank': 2 },
                    { 'ticketNumber': '508', 'prizeRank': 3 },
                    { 'ticketNumber': '509', 'prizeRank': 4 },
                    { 'ticketNumber': '365', 'prizeRank': 5 }]
                },
                {
                    'name': 'Monday Choice Weekly Lottery (MOC-5th Draw)',
                    'drawDate': '2025-06-30T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'KL 68678', 'prizeRank': 1 },
                    { 'ticketNumber': '3102', 'prizeRank': 2 },
                    { 'ticketNumber': '617', 'prizeRank': 3 },
                    { 'ticketNumber': '304', 'prizeRank': 4 },
                    { 'ticketNumber': '347', 'prizeRank': 5 }]
                },
                {
                    'name': 'Tuesday Choice Weekly Lottery (TUC-5th Draw)',
                    'drawDate': '2025-07-01T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'DL 44895', 'prizeRank': 1 },
                    { 'ticketNumber': '4021', 'prizeRank': 2 },
                    { 'ticketNumber': '676', 'prizeRank': 3 },
                    { 'ticketNumber': '561', 'prizeRank': 4 },
                    { 'ticketNumber': '846', 'prizeRank': 5 }]
                },
                {
                    'name': 'Wednesday Choice Weekly Lottery (WEC-5th Draw)',
                    'drawDate': '2025-07-02T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'TN 57869', 'prizeRank': 1 },
                    { 'ticketNumber': '3721', 'prizeRank': 2 },
                    { 'ticketNumber': '899', 'prizeRank': 3 },
                    { 'ticketNumber': '082', 'prizeRank': 4 },
                    { 'ticketNumber': '419', 'prizeRank': 5 }]
                },
                {
                    'name': 'Thursday Choice Weekly Lottery (THC-5th Draw)',
                    'drawDate': '2025-07-03T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'GJ 29042', 'prizeRank': 1 },
                    { 'ticketNumber': '1652', 'prizeRank': 2 },
                    { 'ticketNumber': '147', 'prizeRank': 3 },
                    { 'ticketNumber': '080', 'prizeRank': 4 },
                    { 'ticketNumber': '557', 'prizeRank': 5 }]
                },
                {
                    'name': 'Friday Choice Weekly Lottery (FRC-5th Draw)',
                    'drawDate': '2025-07-04T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'MH 44070', 'prizeRank': 1 },
                    { 'ticketNumber': '1485', 'prizeRank': 2 },
                    { 'ticketNumber': '992', 'prizeRank': 3 },
                    { 'ticketNumber': '937', 'prizeRank': 4 },
                    { 'ticketNumber': '848', 'prizeRank': 5 }]
                },
                {
                    'name': 'Saturday Choice Weekly Lottery (SAC-5th Draw)',
                    'drawDate': '2025-07-05T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'TN 93818', 'prizeRank': 1 },
                    { 'ticketNumber': '5432', 'prizeRank': 2 },
                    { 'ticketNumber': '994', 'prizeRank': 3 },
                    { 'ticketNumber': '945', 'prizeRank': 4 },
                    { 'ticketNumber': '835', 'prizeRank': 5 }]
                },
                {
                    'name': 'Sunday Choice Weekly Lottery (SUC-6th Draw)',
                    'drawDate': '2025-07-06T09:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'MH 86416', 'prizeRank': 1 },
                    { 'ticketNumber': '2181', 'prizeRank': 2 },
                    { 'ticketNumber': '766', 'prizeRank': 3 },
                    { 'ticketNumber': '454', 'prizeRank': 4 },
                    { 'ticketNumber': '790', 'prizeRank': 5 }]
                },
                {
                    'name': 'Monday Choice Weekly Lottery (MOC-6th Draw)',
                    'drawDate': '2025-07-07T09:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'MH 31012', 'prizeRank': 1 },
                    { 'ticketNumber': '1997', 'prizeRank': 2 },
                    { 'ticketNumber': '946', 'prizeRank': 3 },
                    { 'ticketNumber': '380', 'prizeRank': 4 },
                    { 'ticketNumber': '886', 'prizeRank': 5 }]
                },
                {
                    'name': 'Tuesday Choice Weekly Lottery (TUC-6th Draw)',
                    'drawDate': '2025-07-08T09:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'DL 77180', 'prizeRank': 1 },
                    { 'ticketNumber': '1532', 'prizeRank': 2 },
                    { 'ticketNumber': '519', 'prizeRank': 3 },
                    { 'ticketNumber': '270', 'prizeRank': 4 },
                    { 'ticketNumber': '984', 'prizeRank': 5 }]
                },
                {
                    'name': 'Wednesday Choice Weekly Lottery (WEC-6th Draw)',
                    'drawDate': '2025-07-09T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'GJ 22105', 'prizeRank': 1 },
                    { 'ticketNumber': '1549', 'prizeRank': 2 },
                    { 'ticketNumber': '894', 'prizeRank': 3 },
                    { 'ticketNumber': '014', 'prizeRank': 4 },
                    { 'ticketNumber': '651', 'prizeRank': 5 }]
                },
                {
                    'name': 'Thursday Choice Weekly Lottery (THC-6th Draw)',
                    'drawDate': '2025-07-10T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'KL 52069', 'prizeRank': 1 },
                    { 'ticketNumber': '5161', 'prizeRank': 2 },
                    { 'ticketNumber': '269', 'prizeRank': 3 },
                    { 'ticketNumber': '600', 'prizeRank': 4 },
                    { 'ticketNumber': '064', 'prizeRank': 5 }]
                },
                {
                    'name': 'Friday Choice Weekly Lottery (FRC-6th Draw)',
                    'drawDate': '2025-07-11T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'DL 56396', 'prizeRank': 1 },
                    { 'ticketNumber': '7282', 'prizeRank': 2 },
                    { 'ticketNumber': '138', 'prizeRank': 3 },
                    { 'ticketNumber': '393', 'prizeRank': 4 },
                    { 'ticketNumber': '304', 'prizeRank': 5 }]
                },
                {
                    'name': 'Saturday Choice Weekly Lottery (SAC-6th Draw)',
                    'drawDate': '2025-07-12T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'GJ 27850', 'prizeRank': 1 },
                    { 'ticketNumber': '8525', 'prizeRank': 2 },
                    { 'ticketNumber': '887', 'prizeRank': 3 },
                    { 'ticketNumber': '706', 'prizeRank': 4 },
                    { 'ticketNumber': '163', 'prizeRank': 5 }]
                },
                {
                    'name': 'Sunday Choice Weekly Lottery (SUC-7th Draw)',
                    'drawDate': '2025-07-13T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'MH 20160', 'prizeRank': 1 },
                    { 'ticketNumber': '2994', 'prizeRank': 2 },
                    { 'ticketNumber': '493', 'prizeRank': 3 },
                    { 'ticketNumber': '298', 'prizeRank': 4 },
                    { 'ticketNumber': '673', 'prizeRank': 5 }]
                },
                {
                    'name': 'Monday Choice Weekly Lottery (MOC-7th Draw)',
                    'drawDate': '2025-07-14T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'MH 24612', 'prizeRank': 1 },
                    { 'ticketNumber': '4328', 'prizeRank': 2 },
                    { 'ticketNumber': '112', 'prizeRank': 3 },
                    { 'ticketNumber': '054', 'prizeRank': 4 },
                    { 'ticketNumber': '525', 'prizeRank': 5 }]
                },
                {
                    'name': 'Tuesday Choice Weekly Lottery (TUC-7th Draw)',
                    'drawDate': '2025-07-15T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'GJ 81674', 'prizeRank': 1 },
                    { 'ticketNumber': '4643', 'prizeRank': 2 },
                    { 'ticketNumber': '494', 'prizeRank': 3 },
                    { 'ticketNumber': '640', 'prizeRank': 4 },
                    { 'ticketNumber': '869', 'prizeRank': 5 }]
                },
                {
                    'name': 'Wednesday Choice Weekly Lottery (WEC-7th Draw)',
                    'drawDate': '2025-07-16T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'DL 39143', 'prizeRank': 1 },
                    { 'ticketNumber': '9385', 'prizeRank': 2 },
                    { 'ticketNumber': '816', 'prizeRank': 3 },
                    { 'ticketNumber': '879', 'prizeRank': 4 },
                    { 'ticketNumber': '188', 'prizeRank': 5 }]
                },
                {
                    'name': 'Thursday Choice Weekly Lottery (THC-7th Draw)',
                    'drawDate': '2025-07-17T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'DL 75399', 'prizeRank': 1 },
                    { 'ticketNumber': '9792', 'prizeRank': 2 },
                    { 'ticketNumber': '884', 'prizeRank': 3 },
                    { 'ticketNumber': '713', 'prizeRank': 4 },
                    { 'ticketNumber': '921', 'prizeRank': 5 }]
                },
                {
                    'name': 'Friday Choice Weekly Lottery (FRC-7th Draw)',
                    'drawDate': '2025-07-18T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'MH 58853', 'prizeRank': 1 },
                    { 'ticketNumber': '5404', 'prizeRank': 2 },
                    { 'ticketNumber': '157', 'prizeRank': 3 },
                    { 'ticketNumber': '665', 'prizeRank': 4 },
                    { 'ticketNumber': '232', 'prizeRank': 5 }]
                },
                {
                    'name': 'Saturday Choice Weekly Lottery (SAC-7th Draw)',
                    'drawDate': '2025-07-19T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'MH 58564', 'prizeRank': 1 },
                    { 'ticketNumber': '6272', 'prizeRank': 2 },
                    { 'ticketNumber': '752', 'prizeRank': 3 },
                    { 'ticketNumber': '205', 'prizeRank': 4 },
                    { 'ticketNumber': '862', 'prizeRank': 5 }]
                },
                {
                    'name': 'Sunday Choice Weekly Lottery (SUC-8th Draw)',
                    'drawDate': '2025-07-20T00:00:00',
                    'prizes': [{ 'rank': 1, 'amount': 100000 },
                    { 'rank': 2, 'amount': 10000 },
                    { 'rank': 3, 'amount': 5000 },
                    { 'rank': 4, 'amount': 1000 },
                    { 'rank': 5, 'amount': 100 }],
                    'winners': [{ 'ticketNumber': 'GJ 25669', 'prizeRank': 1 },
                    { 'ticketNumber': '5469', 'prizeRank': 2 },
                    { 'ticketNumber': '583', 'prizeRank': 3 },
                    { 'ticketNumber': '353', 'prizeRank': 4 },
                    { 'ticketNumber': '615', 'prizeRank': 5 }]
                }
            ]
        isLotteryExist = await Lottery.findOne({})
        if (isLotteryExist) { 
           return res.status(400).json({ succes: false, message: 'Lottery Already exist' }) 
        }
        
        let savedItems = await Lottery.insertMany(lotteries)
        return res.status(200).json({savedItems})
    },
}

module.exports = startFun;