const Lottery = require("../model/lotterySchema");
const Charge = require("../model/ticketChargeSchema");
const Booking = require("../model/bookingsSchema");
const Agent = require("../model/agentSchema");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const moment = require("moment-timezone");

const bookingHelper = {

  // Get bookings with filters, sorting, and pagination + KPIs
  getBookingsWithFilters: async (queryParams) => {
    try {
      const {
        page = 1,
        limit = 25,
        customerSearch,
        fromDateTime,
        toDateTime,
        childLotteryId,
        agentId,
        status,
        sort = 'booking.date_desc',
        win
      } = queryParams;

      // Build match conditions
      const matchConditions = {};

      // Customer search (name or phone)
      if (customerSearch && customerSearch.trim()) {
        matchConditions.$or = [
          { "customer.name": { $regex: customerSearch.trim(), $options: 'i' } },
          { "customer.phone": { $regex: customerSearch.trim(), $options: 'i' } }
        ];
      }



      // Date range filter
      if (fromDateTime || toDateTime) {
        matchConditions["booking.date"] = {};
        if (fromDateTime) {
          matchConditions["booking.date"].$gte = new Date(fromDateTime);
        }
        if (toDateTime) {
          matchConditions["booking.date"].$lte = new Date(toDateTime);
        }
      }

      // Child lottery filter
      if (childLotteryId && childLotteryId.trim()) {
        matchConditions["tickets.lottery.timeId"] = childLotteryId
      }

      // Agent filter
      if (agentId && agentId.trim()) {
        matchConditions["agent.id"] = new mongoose.Types.ObjectId(agentId);
      }

      // Status filter
      if (status && status.trim()) {
        matchConditions["booking.status"] = status;
      }

      // 🟢 WIN filter (newly added)
      if (win && win.trim()) {
        if (win === "WON") {
          // Get documents having at least one ticket with isWon = true
          matchConditions["tickets"] = { $elemMatch: { isWon: true } };
        } else if (win === "NOT_WON") {
          // Get documents having NO ticket with isWon = true
          matchConditions["tickets.isWon"] = { $ne: true };
        }
      }

      // Build sort conditions
      const [sortField, sortDirection] = sort.split('_');
      const sortConditions = {};

      switch (sortField) {
        case 'booking.date':
          sortConditions["booking.date"] = sortDirection === 'desc' ? -1 : 1;
          break;
        case 'agent.name':
          sortConditions["agent.name"] = sortDirection === 'desc' ? -1 : 1;
          break;
        case 'financial.totalAmount':
          sortConditions["financial.totalAmount"] = sortDirection === 'desc' ? -1 : 1;
          break;
        case 'financial.quantity':
          sortConditions["financial.quantity"] = sortDirection === 'desc' ? -1 : 1;
          break;
        default:
          sortConditions["booking.date"] = -1; // Default sort
      }

      // Calculate pagination
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;

      // Execute query with aggregation for better performance + KPIs
      const pipeline = [
        { $match: matchConditions },
        { $sort: sortConditions },
        {
          $facet: {
            // Paginated bookings data
            bookings: [
              { $skip: skip },
              { $limit: limitNumber },
              {
                $addFields: {
                  displayId: {
                    $concat: ["TKT-", "$ticketNumber"]
                  }
                }
              }
            ],

            // Total count for pagination
            totalCount: [
              { $count: "count" }
            ],

            // KPI calculations based on filtered data
            kpiData: [
              {
                $group: {
                  _id: null,
                  // Total number of bookings (totalTickets)
                  totalTickets: { $sum: 1 },

                  // Total number of individual ticket numbers across all bookings
                  totalTicketNumbers: { $sum: { $size: "$tickets" } },

                  // Total revenue from all bookings
                  totalRevenue: { $sum: "$financial.totalAmount" },

                  // Total won ticket numbers (sum of tickets where isWon = true)
                  totalWonTicketNumbers: {
                    $sum: {
                      $size: {
                        $filter: {
                          input: "$tickets",
                          cond: { $eq: ["$$this.isWon", true] }
                        }
                      }
                    }
                  },

                  // Additional useful KPIs
                  totalActiveBookings: {
                    $sum: {
                      $cond: [{ $eq: ["$booking.status", "active"] }, 1, 0]
                    }
                  },
                  totalCancelledBookings: {
                    $sum: {
                      $cond: [{ $eq: ["$booking.status", "cancelled"] }, 1, 0]
                    }
                  },
                  averageBookingValue: { $avg: "$financial.totalAmount" },
                  totalSubtotal: { $sum: "$financial.subtotal" },
                  totalTax: { $sum: "$financial.tax" }
                }
              }
            ]
          }
        }
      ];

      const result = await Booking.aggregate(pipeline);
      const bookings = result[0].bookings;
      const totalItems = result[0].totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalItems / limitNumber);
      const kpiData = result[0].kpiData[0] || {};

      // Prepare KPI object with proper formatting
      const kpi = {
        totalTickets: kpiData.totalTickets || 0,
        totalTicketNumbers: kpiData.totalTicketNumbers || 0,
        totalRevenue: parseFloat((kpiData.totalRevenue || 0).toFixed(2)),
        totalWonTicketNumbers: kpiData.totalWonTicketNumbers || 0,

        // Additional KPIs for better insights
        totalActiveBookings: kpiData.totalActiveBookings || 0,
        totalCancelledBookings: kpiData.totalCancelledBookings || 0,
        averageBookingValue: parseFloat((kpiData.averageBookingValue || 0).toFixed(2)),
        totalSubtotal: parseFloat((kpiData.totalSubtotal || 0).toFixed(2)),
        totalTax: parseFloat((kpiData.totalTax || 0).toFixed(2)),

        // Calculated metrics
        winRate: kpiData.totalTicketNumbers > 0
          ? parseFloat(((kpiData.totalWonTicketNumbers / kpiData.totalTicketNumbers) * 100).toFixed(2))
          : 0,
        cancelRate: kpiData.totalTickets > 0
          ? parseFloat(((kpiData.totalCancelledBookings / kpiData.totalTickets) * 100).toFixed(2))
          : 0
      };

      return {
        success: true,
        bookings: bookings,
        pagination: {
          currentPage: pageNumber,
          totalPages: totalPages,
          totalItems: totalItems,
          itemsPerPage: limitNumber
        },
        kpi: kpi
      };

    } catch (error) {
      console.error('Error in getBookingsWithFilters:', error);
      throw error;
    }
  },

  // Get specific booking by ID
  getBookingById: async (bookingId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new Error('Invalid booking ID format');
      }

      const booking = await Booking.findById(bookingId);

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Add displayId virtual field
      const bookingObj = booking.toObject();
      bookingObj.displayId = `TKT-${booking.ticketNumber}`;

      return {
        success: true,
        booking: bookingObj
      };

    } catch (error) {
      console.error('Error in getBookingById:', error);
      throw error;
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, newStatus) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new Error('Invalid booking ID format');
      }

      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          "booking.status": newStatus,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Add displayId virtual field
      const bookingObj = booking.toObject();
      bookingObj.displayId = `TKT-${booking.ticketNumber}`;

      return {
        success: true,
        message: "Booking status updated successfully",
        booking: bookingObj
      };

    } catch (error) {
      console.error('Error in updateBookingStatus:', error);
      throw error;
    }
  },

  // Get child lotteries for dropdown (winners array items from lottery schema)
  getChildLotteries: async () => {
    try {
      const pipeline = [
        {
          $match: {
            winners: { $exists: true, $not: { $size: 0 } }
          }
        },
        {
          $unwind: "$winners"
        },
        {
          $project: {
            parentId: "$_id",
            childId: "$winners._id",
            lotteryName: {
              $concat: [
                "$name",
                { $cond: [{ $ne: ["$name2", null] }, { $concat: [" - ", "$name2"] }, ""] },
                " - ",
                {
                  $dateToString: {
                    format: "%H:%M",
                    date: "$winners.resultTime",
                    timezone: "Asia/Dubai"
                  }
                }
              ]
            },
            drawDate: "$drawDate"
          }
        },
        {
          $sort: { drawDate: -1 }
        }
      ];

      const childLotteries = await Lottery.aggregate(pipeline);

      return {
        success: true,
        childLotteries: childLotteries
      };

    } catch (error) {
      console.error('Error in getChildLotteries:', error);
      throw error;
    }
  },

  // Get agents dropdown (simplified)
  getAgentsDropdown: async () => {
    try {
      const agents = await Agent.find(
        { isActive: true },
        { _id: 1, name: 1 }
      ).sort({ name: 1 });

      return {
        success: true,
        agents: agents
      };

    } catch (error) {
      console.error('Error in getAgentsDropdown:', error);
      throw error;
    }
  },

  // Create new booking
  createBooking: async (bookingData,req,res) => {
    try {
      // Generate unique ticket number
      const ticketNumber = await bookingHelper.generateUniqueTicketNumber();

      // Process tickets with validation
      const processedTickets = [];
      
      for (const ticket of bookingData.tickets) {
        const lottery = await Lottery.findById(ticket.lottery.id);
        if (!lottery) {
          throw new Error(`Lottery not found for ticket ${ticket.number}`);
        }

        // 🚨 VALIDATE: Check if the provided timeId exists in lottery winners
        if (!ticket.lottery.timeId) {
          throw new Error(`TimeId is required for ticket ${ticket.number}`);
        }

        const childLottery = lottery.winners.find(w => 
          w._id.toString() === ticket.lottery.timeId.toString()
        );
        
        if (!childLottery) {
          throw new Error(`Child lottery not found with timeId: ${ticket.lottery.timeId} for ticket ${ticket.number}`);
        }

        // Use the validated timeId and child lottery data
        processedTickets.push({
          lottery: {
            id: lottery._id,
            name: lottery.name,
            drawNumber: lottery.drawNumber,
            drawDate: childLottery.resultTime, // Use child lottery's resultTime
            timeId: childLottery._id // Use the validated child lottery _id
          },
          number: ticket.number,
          type: ticket.type,
          chargeAmount: ticket.chargeAmount,
          isWon: false
        });
      }

      // Create booking object
      const newBooking = new Booking({
        ticketNumber: ticketNumber,
        customer: bookingData.customer,
        agent: {
          name: req.session.admin.name || 'Agent Name',
          id: req.session.admin.id || null,
          phone: 'NA',
          role: ['admin']
        },
        booking: {
          date: new Date(),
          status: 'active'
        },
        tickets: processedTickets,
        financial: bookingData.financial,
        payment: bookingData.payment || {
          method: 'cash',
          status: 'pending',
          reference: ''
        }
      });

      // Save booking
      const savedBooking = await newBooking.save();

      // Add displayId virtual field
      const bookingObj = savedBooking.toObject();
      bookingObj.displayId = `TKT-${savedBooking.ticketNumber}`;

      
      return res.status(200).json({
        success: true,
        message: "Booking saved successfully",
        data: bookingObj,
      });

    } catch (error) {
      console.error('Error in createBooking:', error);
      // throw error;
      return res.status(502).json({
        success: false,
        message: "An Error Occured..",
        data: null,
      });
    }
  },

  // Generate unique ticket number
  generateUniqueTicketNumber: async () => {
    try {
      let isUnique = false;
      let ticketNumber;

      while (!isUnique) {
        // Generate random 6-digit number
        const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        ticketNumber = `TKT${randomNum}`;

        // Check if it already exists
        const existingBooking = await Booking.findOne({ ticketNumber: ticketNumber });
        if (!existingBooking) {
          isUnique = true;
        }
      }

      return ticketNumber;

    } catch (error) {
      console.error('Error in generateUniqueTicketNumber:', error);
      throw error;
    }
  },

  // Cancel booking (soft delete by changing status)
  cancelBooking: async (bookingId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new Error('Invalid booking ID format');
      }

      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          "booking.status": "cancelled",
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!booking) {
        throw new Error('Booking not found');
      }

      return {
        success: true,
        message: "Booking cancelled successfully"
      };

    } catch (error) {
      console.error('Error in cancelBooking:', error);
      throw error;
    }
  },

  // Get agents with filters (for full agent management)
  getAgentsWithFilters: async (queryParams) => {
    try {
      const {
        page = 1,
        limit = 50,
        status,
        search,
        sort = 'createdAt_desc'
      } = queryParams;

      // Build match conditions
      const matchConditions = {};

      // Status filter
      if (status && status.trim()) {
        matchConditions.isActive = status === 'true';
      }

      // Search filter
      if (search && search.trim()) {
        matchConditions.$or = [
          { name: { $regex: search.trim(), $options: 'i' } },
          { email: { $regex: search.trim(), $options: 'i' } },
          { phone: { $regex: search.trim(), $options: 'i' } }
        ];
      }

      // Build sort conditions
      const [sortField, sortDirection] = sort.split('_');
      const sortConditions = {};

      switch (sortField) {
        case 'name':
          sortConditions.name = sortDirection === 'desc' ? -1 : 1;
          break;
        case 'createdAt':
          sortConditions.createdAt = sortDirection === 'desc' ? -1 : 1;
          break;
        default:
          sortConditions.createdAt = -1; // Default sort
      }

      // Calculate pagination
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;

      // Execute query
      const agents = await Agent.find(matchConditions)
        .sort(sortConditions)
        .skip(skip)
        .limit(limitNumber);

      const totalItems = await Agent.countDocuments(matchConditions);
      const totalPages = Math.ceil(totalItems / limitNumber);

      return {
        success: true,
        agents: agents,
        pagination: {
          currentPage: pageNumber,
          totalPages: totalPages,
          totalItems: totalItems,
          itemsPerPage: limitNumber
        }
      };

    } catch (error) {
      console.error('Error in getAgentsWithFilters:', error);
      throw error;
    }
  }
};

module.exports = bookingHelper;