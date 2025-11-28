const Lottery = require("../model/lotterySchema");
const Charge = require("../model/ticketChargeSchema");
const Booking = require("../model/bookingsSchema");
const Agent = require("../model/agentSchema");
const mongoose = require("mongoose");
const moment = require("moment-timezone");

const bookingHelper = {
  
  getBookingsWithFilters: async (queryParams,req) => {
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

        matchConditions["agent.id"]= new mongoose.Types.ObjectId(req.session.agent.id);
  
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
  
        // Status filter
        if (status && status.trim()) {
          if(status ==="ALL"){
            // If status is ALL, we don't need to filter by status
          }
          else if (status === "PAID" || status === "UNPAID")
            matchConditions["tickets.status"] = status;
          else if (status === "NOT_WINNER") {
            // Get documents where ALL tickets have status "NOT_WINNER"
            // AND exclude documents that have at least one ticket with "PAID" or "UNPAID"
            matchConditions["tickets.status"] = "NOT_WINNER";
            matchConditions["tickets"] = {
              $not: {
                $elemMatch: {
                  status: { $in: ["PAID", "UNPAID"] }
                }
              }
            };
          }
  
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
                      $concat: ["", "$ticketNumber"]
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

 // Get bookings with filters, sorting, and pagination + KPIs
// getBookingsWithFilters: async (queryParams) => {
//   try {
//     const {
//       page = 1,
//       limit = 25,
//       customerSearch,
//       fromDateTime,
//       toDateTime,
//       childLotteryId,
//       agentId,
//       status,
//       win,//this may be 'WON' or 'NOT_WON'
//       sort = 'booking.date_desc'
//     } = queryParams;

//     // Build match conditions
//     const matchConditions = {};

//     // Customer search (name or phone)
//     if (customerSearch && customerSearch.trim()) {
//       matchConditions.$or = [
//         { "customer.name": { $regex: customerSearch.trim(), $options: 'i' } },
//         { "customer.phone": { $regex: customerSearch.trim(), $options: 'i' } }
//       ];
//     }

//     // Date range filter
//     if (fromDateTime || toDateTime) {
//       matchConditions["booking.date"] = {};
//       if (fromDateTime) {
//         matchConditions["booking.date"].$gte = new Date(fromDateTime);
//       }
//       if (toDateTime) {
//         matchConditions["booking.date"].$lte = new Date(toDateTime);
//       }
//     }

//     // Child lottery filter
//     if (childLotteryId && childLotteryId.trim()) {
//       matchConditions["tickets.lottery.timeId"] = childLotteryId
//     }

//     // Agent filter
//     if (agentId && agentId.trim()) {
//       matchConditions["agent.id"] = new mongoose.Types.ObjectId(agentId);
//     }

//     // Status filter
//     if (status && status.trim()) {
//       matchConditions["booking.status"] = status;
//     }

//     // Build sort conditions
//     const [sortField, sortDirection] = sort.split('_');
//     const sortConditions = {};
    
//     switch (sortField) {
//       case 'booking.date':
//         sortConditions["booking.date"] = sortDirection === 'desc' ? -1 : 1;
//         break;
//       case 'agent.name':
//         sortConditions["agent.name"] = sortDirection === 'desc' ? -1 : 1;
//         break;
//       case 'financial.totalAmount':
//         sortConditions["financial.totalAmount"] = sortDirection === 'desc' ? -1 : 1;
//         break;
//       case 'financial.quantity':
//         sortConditions["financial.quantity"] = sortDirection === 'desc' ? -1 : 1;
//         break;
//       default:
//         sortConditions["booking.date"] = -1; // Default sort
//     }

//     // Calculate pagination
//     const pageNumber = parseInt(page);
//     const limitNumber = parseInt(limit);
//     const skip = (pageNumber - 1) * limitNumber;

//     // Execute query with aggregation for better performance + KPIs
//     const pipeline = [
//       { $match: matchConditions },
//       { $sort: sortConditions },
//       {
//         $facet: {
//           // Paginated bookings data
//           bookings: [
//             { $skip: skip },
//             { $limit: limitNumber },
//             {
//               $addFields: {
//                 displayId: {
//                   $concat: ["TKT-", "$ticketNumber"]
//                 }
//               }
//             }
//           ],
          
//           // Total count for pagination
//           totalCount: [
//             { $count: "count" }
//           ],
          
//           // KPI calculations based on filtered data
//           kpiData: [
//             {
//               $group: {
//                 _id: null,
//                 // Total number of bookings (totalTickets)
//                 totalTickets: { $sum: 1 },
                
//                 // Total number of individual ticket numbers across all bookings
//                 totalTicketNumbers: { $sum: { $size: "$tickets" } },
                
//                 // Total revenue from all bookings
//                 totalRevenue: { $sum: "$financial.totalAmount" },
                
//                 // Total won ticket numbers (sum of tickets where isWon = true)
//                 totalWonTicketNumbers: {
//                   $sum: {
//                     $size: {
//                       $filter: {
//                         input: "$tickets",
//                         cond: { $eq: ["$$this.isWon", true] }
//                       }
//                     }
//                   }
//                 },
                
//                 // Additional useful KPIs
//                 totalActiveBookings: {
//                   $sum: {
//                     $cond: [{ $eq: ["$booking.status", "active"] }, 1, 0]
//                   }
//                 },
//                 totalCancelledBookings: {
//                   $sum: {
//                     $cond: [{ $eq: ["$booking.status", "cancelled"] }, 1, 0]
//                   }
//                 },
//                 averageBookingValue: { $avg: "$financial.totalAmount" },
//                 totalSubtotal: { $sum: "$financial.subtotal" },
//                 totalTax: { $sum: "$financial.tax" }
//               }
//             }
//           ]
//         }
//       }
//     ];

//     const result = await Booking.aggregate(pipeline);
//     const bookings = result[0].bookings;
//     const totalItems = result[0].totalCount[0]?.count || 0;
//     const totalPages = Math.ceil(totalItems / limitNumber);
//     const kpiData = result[0].kpiData[0] || {};

//     // Prepare KPI object with proper formatting
//     const kpi = {
//       totalTickets: kpiData.totalTickets || 0,
//       totalTicketNumbers: kpiData.totalTicketNumbers || 0,
//       totalRevenue: parseFloat((kpiData.totalRevenue || 0).toFixed(2)),
//       totalWonTicketNumbers: kpiData.totalWonTicketNumbers || 0,
      
//       // Additional KPIs for better insights
//       totalActiveBookings: kpiData.totalActiveBookings || 0,
//       totalCancelledBookings: kpiData.totalCancelledBookings || 0,
//       averageBookingValue: parseFloat((kpiData.averageBookingValue || 0).toFixed(2)),
//       totalSubtotal: parseFloat((kpiData.totalSubtotal || 0).toFixed(2)),
//       totalTax: parseFloat((kpiData.totalTax || 0).toFixed(2)),
      
//       // Calculated metrics
//       winRate: kpiData.totalTicketNumbers > 0 
//         ? parseFloat(((kpiData.totalWonTicketNumbers / kpiData.totalTicketNumbers) * 100).toFixed(2))
//         : 0,
//       cancelRate: kpiData.totalTickets > 0 
//         ? parseFloat(((kpiData.totalCancelledBookings / kpiData.totalTickets) * 100).toFixed(2))
//         : 0
//     };

//     return {
//       success: true,
//       bookings: bookings,
//       pagination: {
//         currentPage: pageNumber,
//         totalPages: totalPages,
//         totalItems: totalItems,
//         itemsPerPage: limitNumber
//       },
//       kpi: kpi
//     };

//   } catch (error) {
//     console.error('Error in getBookingsWithFilters:', error);
//     throw error;
//   }
// },


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
  updateBookingStatus: async (req, res) => {
      try {
        let {
          bookingId,
          status,
          timeId,
          ticketNumber,
          numberId
        } = req.body;
  
        let newStatus = status;
        console.log('req.body:\n', req.body);
  
        // Validate required fields
        if (!bookingId || !newStatus || !timeId || !ticketNumber || !numberId) {
          return res.status(400).json({
            message: 'Missing required fields: bookingId, newStatus, timeId, ticketNumber, numberId'
          });
        }
  
        // 1. Define the Query Filter
        const filter = {
          _id: bookingId,
          'tickets.lottery.timeId': timeId,
          'tickets.number': ticketNumber,
          'tickets.numberId': numberId
        };
  
        // 2. Define the Update Operation
        const update = {
          $set: {
            'tickets.$.status': newStatus
          }
        };
  
        // 3. Execute the Update
        const updatedBooking = await Booking.findOneAndUpdate(
          filter,
          update,
          {
            new: true,
            runValidators: true
          }
        );
  
        // 4. Check the Result
        if (!updatedBooking) {
          return res.status(404).json({
            message: 'Booking not found or no ticket matched the specified criteria.'
          });
        }
  
        // Find the updated ticket to verify the change
        const updatedTicket = updatedBooking.tickets.find(ticket =>
          ticket.lottery?.timeId === timeId &&
          ticket.number === ticketNumber &&
          ticket.numberId === numberId
        );
  
        if (!updatedTicket) {
          return res.status(404).json({
            message: 'Ticket found but criteria not met after update.'
          });
        }
  
        console.log('✅ Booking updated successfully. Updated ticket:', updatedTicket);
  
        // 5. Send a Success Response
        return res.status(200).json({
          success: true,
          message: 'Ticket status updated successfully.',
          booking: updatedBooking,
          updatedTicket: updatedTicket
        });
  
      } catch (error) {
        console.error('Error in updateBookingStatus:', error);
        return res.status(500).json({
          message: 'Internal server error',
          error: error.message
        });
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
          $let: {
            vars: {
              hour24: {
                $toInt: {
                  $dateToString: {
                    format: "%H",
                    date: "$winners.resultTime",
                    timezone: "Asia/Dubai"
                  }
                }
              },
              minute: {
                $dateToString: {
                  format: "%M",
                  date: "$winners.resultTime",
                  timezone: "Asia/Dubai"
                }
              }
            },
            in: {
              $concat: [
                // 12-hour hour (0-11, then convert 0 to 12)
                {
                  $toString: {
                    $cond: [
                      // If hour is 0 (midnight), set to 12
                      { $eq: ["$$hour24", 0] },
                      12,
                      // If hour is > 12, subtract 12. Otherwise, keep original hour.
                      { $cond: [{ $gt: ["$$hour24", 12] }, { $subtract: ["$$hour24", 12] }, "$$hour24"] }
                    ]
                  }
                },
                ":",
                "$$minute",
                " ",
                // AM/PM designator
                {
                  $cond: [
                    { $lt: ["$$hour24", 12] },
                    "AM",
                    "PM"
                  ]
                }
              ]
            }
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
  // createBooking: async (bookingData,req) => {
  //   try {
  //     // Generate unique ticket number
  //     const ticketNumber = await bookingHelper.generateUniqueTicketNumber();

  //     // Validate agent exists
  //     // const agent = await Agent.findById();
  //     // if (!agent) {
  //     //   throw new Error('Agent not found');
  //     // }

  //     // Validate lottery and child lottery exist for each ticket
  //     for (const ticket of bookingData.tickets) {
  //       const lottery = await Lottery.findById(ticket.lottery.id);
  //       if (!lottery) {
  //         throw new Error(`Lottery not found for ticket ${ticket.number}`);
  //       }

  //       const childLottery = lottery.winners.find(w => w._id.toString() === ticket.lottery.timeId);
  //       if (!childLottery) {
  //         throw new Error(`Child lottery not found for ticket ${ticket.number}`);
  //       }
  //     }

  //     // Create booking object
  //     const newBooking = new Booking({
  //       ticketNumber: ticketNumber,
  //       customer: bookingData.customer,
  //       agent: {
  //         name: req.session.agent.name || '',
  //         id: req.session.agent.id || '',
  //         phone: req.session.agent.phone || '',
  //         role: ['agent']
  //       },
  //       booking: {
  //         date: new Date(),
  //         status: 'active'
  //       },
  //       tickets: bookingData.tickets,
  //       financial: bookingData.financial,
  //       payment: bookingData.payment || {
  //         method: 'cash',
  //         status: 'pending',
  //         reference: ''
  //       }
  //     });

  //     // Save booking
  //     const savedBooking = await newBooking.save();

  //     // Add displayId virtual field
  //     const bookingObj = savedBooking.toObject();
  //     bookingObj.displayId = `TKT-${savedBooking.ticketNumber}`;

  //     return {
  //       success: true,
  //       message: "Booking created successfully",
  //       booking: bookingObj
  //     };

  //   } catch (error) {
  //     console.error('Error in createBooking:', error);
  //     throw error;
  //   }
  // },
  createBooking: async (bookingData, req, res) => {
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
  
          // 🚨 Check for duplicate in database
          const existingTicket = await Booking.findOne({
            'tickets.lottery.id': lottery._id,
            'tickets.lottery.timeId': childLottery._id,
            'tickets.number': ticket.number
          });
  
          // if (existingTicket) {
          //   console.log(`\nTicket number "${ticket.number}" already exists for this lottery and draw time. Please choose a different number.\n`)
          //   return res.status(400).json({
          //     success: false,
          //     message: `Ticket number "${ticket.number}" already exists for this lottery and draw time. Please choose a different number.`,
          //     data: null
          //   });
          // }
  
          // Use the validated timeId and child lottery data
          processedTickets.push({
            lottery: {
              id: lottery._id,
              name: lottery.name,
              drawNumber: lottery.drawNumber,
              drawDate: childLottery.resultTime, // Use child lottery's resultTime
              timeId: childLottery._id // Use the validated child lottery _id
            },
            numberId: 'NumberId_' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
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
            name: req.session.agent.name || 'Agent Name',
            id: req.session.agent.id || null,
            phone: req.session.agent.phone || 'NA',
            role: ['agent']
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