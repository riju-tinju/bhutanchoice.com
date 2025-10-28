var express = require('express');
var router = express.Router();
var startFun = require("../helper/startingHelper")
var indexFun = require("../helper/indexHelper")
var agentFun = require("../helper/agentHelper")
var bookingFun = require("../helper/bookingHelper")

/* GET bookings listing page. */
router.get('/', async function (req, res, next) {
  res.render('pages/booking/listing')
});

// GET /api/bookings - Retrieve bookings with backend filtering, sorting, and pagination
router.get('/api/bookings', async function (req, res, next) {
  try {
    const result = await bookingFun.getBookingsWithFilters(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in GET /api/bookings:', error);
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
    const result = await bookingFun.getBookingById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in GET /api/bookings/:id:', error);
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
    const { bookingStatus } = req.body;

    // Validate status
    if (!['active', 'cancelled'].includes(bookingStatus)) {
      return res.status(400).json({
        "success": false,
        "message": "Invalid booking status. Must be 'active' or 'cancelled'",
        "error": "VALIDATION_ERROR"
      });
    }

    const result = await bookingFun.updateBookingStatus(req.params.id, bookingStatus);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in PUT /api/bookings/:id/status:', error);
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
    const result = await bookingFun.getChildLotteries();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in GET /api/child-lotteries:', error);
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
    const result = await bookingFun.getAgentsDropdown();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in GET /api/agents/dropdown:', error);
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
    console.log('\n\nArrived in bookings.js \n');
    console.log('Received booking data:\n', bookingData);
    // Validate required fields
    if (!bookingData.customer || !bookingData.customer.name || !bookingData.customer.phone) {
      return res.status(400).json({
        "success": false,
        "message": "Customer information is required",
        "error": "VALIDATION_ERROR"
      });
    }

    // if (!bookingData.agent || !bookingData.agent.id) {
    //   return res.status(400).json({
    //     "success": false,
    //     "message": "Agent information is required",
    //     "error": "VALIDATION_ERROR"
    //   });
    // }

    if (!bookingData.tickets || bookingData.tickets.length === 0) {
      return res.status(400).json({
        "success": false,
        "message": "At least one ticket is required",
        "error": "VALIDATION_ERROR"
      });
    }
    
    console.log('Booking Data.tickets:\n\n', bookingData.tickets);
    const result = await bookingFun.createBooking(bookingData,req,res);
    // res.status(201).json(result);
  } catch (error) {
    console.error('Error in POST /api/bookings:', error);
    if (error.message.includes('duplicate') || error.message.includes('unique')) {
      res.status(409).json({
        "success": false,
        "message": "Duplicate ticket number or booking already exists",
        "error": "DUPLICATE_ERROR"
      });
    } else if (error.message.includes('validation')) {
      res.status(400).json({
        "success": false,
        "message": error.message,
        "error": "VALIDATION_ERROR"
      });
    } else {
      res.status(500).json({
        "success": false,
        "message": "Error creating booking",
        "error": "SERVER_ERROR"
      });
    }
  }
});

// DELETE /api/bookings/:id - Cancel/delete booking
router.delete('/api/bookings/:id', async function (req, res, next) {
  try {
    const result = await bookingFun.cancelBooking(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in DELETE /api/bookings/:id:', error);
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
    const result = await bookingFun.getAgentsWithFilters(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in GET /api/agents:', error);
    res.status(500).json({
      "success": false,
      "message": "Error retrieving agents",
      "error": "SERVER_ERROR"
    });
  }
});

module.exports = router;