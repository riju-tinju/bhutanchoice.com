var express = require('express');
var router = express.Router();
var startFun = require("../helper/startingHelper")
var indexFun = require("../helper/indexHelper")
var agentFun = require("../helper/agentHelper")
var bookingFun = require("../helper/bookingHelper")

/* GET agents listing page. */
router.get('/', async function (req, res, next) {
  res.render('pages/booking/listing')
});
// GET /api/bookings - Retrieve bookings with backend filtering, sorting, and pagination
router.get('/api/bookings', async function (req, res, next) {
  try {
    // Extract query parameters
    const {
      page = 1,
      limit = 25,
      customerSearch,
      fromDateTime,
      toDateTime,
      childLotteryId,
      agentId,
      status,
      sort = 'booking.date_desc'
    } = req.query;

    // TODO: Implement actual database filtering and sorting logic here
    // This is example response structure

    res.status(200).json({
      "success": true,
      "bookings": [
        {
          "_id": "64f8a5b2c123456789abcdef",
          "ticketNumber": "TKT001234",
          "displayId": "TKT-001234",
          "customer": {
            "name": "John Doe",
            "phone": "+1234567890"
          },
          "agent": {
            "name": "Jane Smith",
            "id": "64f8a5b2c123456789abcd01",
            "phone": "+0987654321",
            "role": ["agent"]
          },
          "booking": {
            "date": "2023-09-06T10:30:00.000Z",
            "status": "active"
          },
          "tickets": [
            {
              "lottery": {
                "id": "64f8a5b2c123456789abcd02",
                "name": "Weekly Mega Draw - Morning",
                "drawNumber": 1234,
                "drawDate": "2023-09-10T10:00:00.000Z",
                "timeId": "64f8a5b2c123456789winner1"
              },
              "number": "12345",
              "type": 5,
              "chargeAmount": 100
            },
            {
              "lottery": {
                "id": "64f8a5b2c123456789abcd02",
                "name": "Weekly Mega Draw - Morning",
                "drawNumber": 1234,
                "drawDate": "2023-09-10T10:00:00.000Z",
                "timeId": "64f8a5b2c123456789winner1"
              },
              "number": "67890",
              "type": 4,
              "chargeAmount": 80
            },
            {
              "lottery": {
                "id": "64f8a5b2c123456789abcd02",
                "name": "Weekly Mega Draw - Morning",
                "drawNumber": 1234,
                "drawDate": "2023-09-10T10:00:00.000Z",
                "timeId": "64f8a5b2c123456789winner1"
              },
              "number": "A5",
              "type": 1,
              "chargeAmount": 20
            }
          ],
          "financial": {
            "quantity": 3,
            "subtotal": 200,
            "tax": 20,
            "totalAmount": 220,
            "currency": "USD"
          },
          "payment": {
            "method": "cash",
            "status": "paid",
            "reference": "PAY123456"
          },
          "createdAt": "2023-09-06T10:30:00.000Z",
          "updatedAt": "2023-09-06T10:30:00.000Z"
        },
        {
          "_id": "64f8a5b2c123456789abcd10",
          "ticketNumber": "TKT001235",
          "displayId": "TKT-001235",
          "customer": {
            "name": "Sarah Wilson",
            "phone": "+1234567891"
          },
          "agent": {
            "name": "Michael Chen",
            "id": "64f8a5b2c123456789abcd02",
            "phone": "+0987654322",
            "role": ["agent", "supervisor"]
          },
          "booking": {
            "date": "2023-09-06T14:15:00.000Z",
            "status": "active"
          },
          "tickets": [
            {
              "lottery": {
                "id": "64f8a5b2c123456789abcd03",
                "name": "Daily Lucky Numbers - Evening",
                "drawNumber": 5678,
                "drawDate": "2023-09-07T18:00:00.000Z",
                "timeId": "64f8a5b2c123456789winner3"
              },
              "number": "9876",
              "type": 4,
              "chargeAmount": 80
            },
            {
              "lottery": {
                "id": "64f8a5b2c123456789abcd03",
                "name": "Daily Lucky Numbers - Evening",
                "drawNumber": 5678,
                "drawDate": "2023-09-07T18:00:00.000Z",
                "timeId": "64f8a5b2c123456789winner3"
              },
              "number": "543",
              "type": 3,
              "chargeAmount": 60
            }
          ],
          "financial": {
            "quantity": 2,
            "subtotal": 140,
            "tax": 14,
            "totalAmount": 154,
            "currency": "USD"
          },
          "payment": {
            "method": "card",
            "status": "pending",
            "reference": "PAY123457"
          },
          "createdAt": "2023-09-06T14:15:00.000Z",
          "updatedAt": "2023-09-06T14:15:00.000Z"
        },
        {
          "_id": "64f8a5b2c123456789abcd11",
          "ticketNumber": "TKT001236",
          "displayId": "TKT-001236",
          "customer": {
            "name": "Robert Johnson",
            "phone": "+1234567892"
          },
          "agent": {
            "name": "Emily Rodriguez",
            "id": "64f8a5b2c123456789abcd03",
            "phone": "+0987654323",
            "role": ["agent"]
          },
          "booking": {
            "date": "2023-09-06T16:45:00.000Z",
            "status": "cancelled"
          },
          "tickets": [
            {
              "lottery": {
                "id": "64f8a5b2c123456789abcd04",
                "name": "Super Saturday Special - Night",
                "drawNumber": 9999,
                "drawDate": "2023-09-09T20:00:00.000Z",
                "timeId": "64f8a5b2c123456789winner4"
              },
              "number": "11111",
              "type": 5,
              "chargeAmount": 150
            }
          ],
          "financial": {
            "quantity": 1,
            "subtotal": 150,
            "tax": 15,
            "totalAmount": 165,
            "currency": "USD"
          },
          "payment": {
            "method": "cash",
            "status": "refunded",
            "reference": "PAY123458"
          },
          "createdAt": "2023-09-06T16:45:00.000Z",
          "updatedAt": "2023-09-06T17:00:00.000Z"
        }
      ],
      "pagination": {
        "currentPage": parseInt(page),
        "totalPages": 10,
        "totalItems": 250,
        "itemsPerPage": parseInt(limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      "success": false,
      "message": "Error retrieving bookings",
      "error": "SERVER_ERROR"
    });
  }
});

// GET /api/bookings/:id - Retrieve specific booking by ID
router.get('/api/bookings/:id', async function (req, res, next) {
  try {
    const { id } = req.params;

    // TODO: Implement actual database lookup by ID

    res.status(200).json({
      "success": true,
      "booking": {
        "_id": "64f8a5b2c123456789abcdef",
        "ticketNumber": "TKT001234",
        "displayId": "TKT-001234",
        "customer": {
          "name": "John Doe",
          "phone": "+1234567890"
        },
        "agent": {
          "name": "Jane Smith",
          "id": "64f8a5b2c123456789abcd01",
          "phone": "+0987654321",
          "role": ["agent"]
        },
        "booking": {
          "date": "2023-09-06T10:30:00.000Z",
          "status": "active"
        },
        "tickets": [
          {
            "lottery": {
              "id": "64f8a5b2c123456789abcd02",
              "name": "Weekly Mega Draw - Morning",
              "drawNumber": 1234,
              "drawDate": "2023-09-10T10:00:00.000Z",
              "timeId": "64f8a5b2c123456789winner1"
            },
            "number": "12345",
            "type": 5,
            "chargeAmount": 100
          },
          {
            "lottery": {
              "id": "64f8a5b2c123456789abcd02",
              "name": "Weekly Mega Draw - Morning",
              "drawNumber": 1234,
              "drawDate": "2023-09-10T10:00:00.000Z",
              "timeId": "64f8a5b2c123456789winner1"
            },
            "number": "67890",
            "type": 4,
            "chargeAmount": 80
          }
        ],
        "financial": {
          "quantity": 2,
          "subtotal": 180,
          "tax": 18,
          "totalAmount": 198,
          "currency": "USD"
        },
        "payment": {
          "method": "cash",
          "status": "paid",
          "reference": "PAY123456"
        },
        "createdAt": "2023-09-06T10:30:00.000Z",
        "updatedAt": "2023-09-06T10:30:00.000Z"
      }
    });

  } catch (error) {
    if (error.message === 'Booking not found') {
      res.status(404).json({
        "success": false,
        "message": "Booking not found",
        "error": "NOT_FOUND"
      });
    } else {
      res.status(500).json({
        "success": false,
        "message": "Error retrieving booking",
        "error": "SERVER_ERROR"
      });
    }
  }
});

// PUT /api/bookings/:id/status - Update booking status
router.put('/api/bookings/:id/status', async function (req, res, next) {
  try {
    const { id } = req.params;
    const { bookingStatus } = req.body;

    // Validate status
    if (!['active', 'cancelled'].includes(bookingStatus)) {
      return res.status(400).json({
        "success": false,
        "message": "Invalid booking status. Must be 'active' or 'cancelled'",
        "error": "VALIDATION_ERROR"
      });
    }

    // TODO: Implement actual database update logic

    res.status(200).json({
      "success": true,
      "message": "Booking status updated successfully",
      "booking": {
        "_id": id,
        "ticketNumber": "TKT001234",
        "displayId": "TKT-001234",
        "customer": {
          "name": "John Doe",
          "phone": "+1234567890"
        },
        "agent": {
          "name": "Jane Smith",
          "id": "64f8a5b2c123456789abcd01",
          "phone": "+0987654321",
          "role": ["agent"]
        },
        "booking": {
          "date": "2023-09-06T10:30:00.000Z",
          "status": bookingStatus
        },
        "tickets": [
          {
            "lottery": {
              "id": "64f8a5b2c123456789abcd02",
              "name": "Weekly Mega Draw - Morning",
              "drawNumber": 1234,
              "drawDate": "2023-09-10T10:00:00.000Z",
              "timeId": "64f8a5b2c123456789winner1"
            },
            "number": "12345",
            "type": 5,
            "chargeAmount": 100
          }
        ],
        "financial": {
          "quantity": 1,
          "subtotal": 100,
          "tax": 10,
          "totalAmount": 110,
          "currency": "USD"
        },
        "payment": {
          "method": "cash",
          "status": "paid",
          "reference": "PAY123456"
        },
        "createdAt": "2023-09-06T10:30:00.000Z",
        "updatedAt": new Date().toISOString()
      }
    });

  } catch (error) {
    if (error.message === 'Booking not found') {
      res.status(404).json({
        "success": false,
        "message": "Booking not found",
        "error": "NOT_FOUND"
      });
    } else {
      res.status(500).json({
        "success": false,
        "message": "Error updating booking status",
        "error": "SERVER_ERROR"
      });
    }
  }
});

// GET /api/child-lotteries - Get child lotteries for filter dropdown
router.get('/api/child-lotteries', async function (req, res, next) {
  try {
    // TODO: Implement actual database query to get child lotteries from winners array

    res.status(200).json({
      "success": true,
      "childLotteries": [
        {
          "parentId": "64f8a5b2c123456789lottery1",
          "childId": "64f8a5b2c123456789winner1",
          "lotteryName": "Weekly Mega Draw - Morning",
          "drawDate": "2023-09-10T10:00:00.000Z"
        },
        {
          "parentId": "64f8a5b2c123456789lottery1",
          "childId": "64f8a5b2c123456789winner2",
          "lotteryName": "Weekly Mega Draw - Evening",
          "drawDate": "2023-09-10T18:00:00.000Z"
        },
        {
          "parentId": "64f8a5b2c123456789lottery2",
          "childId": "64f8a5b2c123456789winner3",
          "lotteryName": "Daily Lucky Numbers - Afternoon",
          "drawDate": "2023-09-07T15:30:00.000Z"
        },
        {
          "parentId": "64f8a5b2c123456789lottery2",
          "childId": "64f8a5b2c123456789winner4",
          "lotteryName": "Daily Lucky Numbers - Evening",
          "drawDate": "2023-09-07T18:00:00.000Z"
        },
        {
          "parentId": "64f8a5b2c123456789lottery3",
          "childId": "64f8a5b2c123456789winner5",
          "lotteryName": "Super Saturday Special - Afternoon",
          "drawDate": "2023-09-09T15:00:00.000Z"
        },
        {
          "parentId": "64f8a5b2c123456789lottery3",
          "childId": "64f8a5b2c123456789winner6",
          "lotteryName": "Super Saturday Special - Night",
          "drawDate": "2023-09-09T20:00:00.000Z"
        },
        {
          "parentId": "64f8a5b2c123456789lottery4",
          "childId": "64f8a5b2c123456789winner7",
          "lotteryName": "Monthly Millionaire Maker - First Draw",
          "drawDate": "2023-09-30T19:00:00.000Z"
        },
        {
          "parentId": "64f8a5b2c123456789lottery4",
          "childId": "64f8a5b2c123456789winner8",
          "lotteryName": "Monthly Millionaire Maker - Final Draw",
          "drawDate": "2023-09-30T21:00:00.000Z"
        }
      ]
    });

  } catch (error) {
    res.status(500).json({
      "success": false,
      "message": "Error retrieving child lotteries",
      "error": "SERVER_ERROR"
    });
  }
});

// GET /api/agents/dropdown - Get simplified agent list for dropdown
router.get('/api/agents/dropdown', async function (req, res, next) {
  try {
    // TODO: Implement actual database query for active agents only

    res.status(200).json({
      "success": true,
      "agents": [
        {
          "_id": "64f8a5b2c123456789abcd01",
          "name": "Jane Smith"
        },
        {
          "_id": "64f8a5b2c123456789abcd02",
          "name": "Michael Chen"
        },
        {
          "_id": "64f8a5b2c123456789abcd03",
          "name": "Emily Rodriguez"
        },
        {
          "_id": "64f8a5b2c123456789abcd04",
          "name": "David Kumar"
        },
        {
          "_id": "64f8a5b2c123456789abcd05",
          "name": "Lisa Thompson"
        },
        {
          "_id": "64f8a5b2c123456789abcd06",
          "name": "James Wilson"
        },
        {
          "_id": "64f8a5b2c123456789abcd07",
          "name": "Maria Garcia"
        },
        {
          "_id": "64f8a5b2c123456789abcd08",
          "name": "Robert Brown"
        }
      ]
    });

  } catch (error) {
    res.status(500).json({
      "success": false,
      "message": "Error retrieving agents",
      "error": "SERVER_ERROR"
    });
  }
});

// POST /api/bookings - Create new booking (for integration with flexible booking system)
router.post('/api/bookings', async function (req, res, next) {
  try {
    const bookingData = req.body;

    // Validate required fields
    if (!bookingData.customer || !bookingData.customer.name || !bookingData.customer.phone) {
      return res.status(400).json({
        "success": false,
        "message": "Customer information is required",
        "error": "VALIDATION_ERROR"
      });
    }

    if (!bookingData.agent || !bookingData.agent.id) {
      return res.status(400).json({
        "success": false,
        "message": "Agent information is required",
        "error": "VALIDATION_ERROR"
      });
    }

    if (!bookingData.tickets || bookingData.tickets.length === 0) {
      return res.status(400).json({
        "success": false,
        "message": "At least one ticket is required",
        "error": "VALIDATION_ERROR"
      });
    }

    // TODO: Implement actual database insertion logic
    // Generate ticket number, calculate totals, save to database

    const newBookingId = "64f8a5b2c123456789abcd" + Math.floor(Math.random() * 100);
    const ticketNumber = "TKT" + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    res.status(201).json({
      "success": true,
      "message": "Booking created successfully",
      "booking": {
        "_id": newBookingId,
        "ticketNumber": ticketNumber,
        "displayId": ticketNumber.replace('TKT', 'TKT-'),
        "customer": bookingData.customer,
        "agent": bookingData.agent,
        "booking": {
          "date": new Date().toISOString(),
          "status": "active"
        },
        "tickets": bookingData.tickets,
        "financial": bookingData.financial,
        "payment": bookingData.payment || {
          "method": "cash",
          "status": "pending",
          "reference": ""
        },
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      "success": false,
      "message": "Error creating booking",
      "error": "SERVER_ERROR"
    });
  }
});

// DELETE /api/bookings/:id - Cancel/delete booking
router.delete('/api/bookings/:id', async function (req, res, next) {
  try {
    const { id } = req.params;

    // TODO: Implement actual database deletion or status update to cancelled

    res.status(200).json({
      "success": true,
      "message": "Booking cancelled successfully"
    });

  } catch (error) {
    if (error.message === 'Booking not found') {
      res.status(404).json({
        "success": false,
        "message": "Booking not found",
        "error": "NOT_FOUND"
      });
    } else {
      res.status(500).json({
        "success": false,
        "message": "Error cancelling booking",
        "error": "SERVER_ERROR"
      });
    }
  }
});

// GET /api/agents - Full agent management API (reuse from agent management system)
router.get('/api/agents', async function (req, res, next) {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      search,
      sort = 'createdAt_desc'
    } = req.query;

    // TODO: Implement actual database query with filtering

    res.status(200).json({
      "success": true,
      "agents": [
        {
          "_id": "64f8a5b2c123456789abcd01",
          "name": "Jane Smith",
          "avatar": "https://example.com/avatars/jane-smith.jpg",
          "email": "jane.smith@example.com",
          "phone": "+0987654321",
          "admin_saved": true,
          "otp": "",
          "isActive": true,
          "createdAt": "2023-09-01T08:30:00.000Z",
          "updatedAt": "2023-09-06T10:15:00.000Z"
        },
        {
          "_id": "64f8a5b2c123456789abcd02",
          "name": "Michael Chen",
          "avatar": "",
          "email": "michael.chen@example.com",
          "phone": "+0987654322",
          "admin_saved": true,
          "otp": "",
          "isActive": true,
          "createdAt": "2023-09-02T09:45:00.000Z",
          "updatedAt": "2023-09-05T14:20:00.000Z"
        },
        {
          "_id": "64f8a5b2c123456789abcd03",
          "name": "Emily Rodriguez",
          "avatar": "https://example.com/avatars/emily-rodriguez.jpg",
          "email": "emily.rodriguez@example.com",
          "phone": "+0987654323",
          "admin_saved": true,
          "otp": "",
          "isActive": true,
          "createdAt": "2023-09-03T13:10:00.000Z",
          "updatedAt": "2023-09-06T09:45:00.000Z"
        }
      ],
      "pagination": {
        "currentPage": parseInt(page),
        "totalPages": 1,
        "totalItems": 3,
        "itemsPerPage": parseInt(limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      "success": false,
      "message": "Error retrieving agents",
      "error": "SERVER_ERROR"
    });
  }
});


module.exports = router;