const Lottery = require("../model/lotterySchema");
const Charge = require("../model/ticketChargeSchema");
const ticketCharge = require("../model/ticketChargeSchema");
const Booking = require("../model/bookingsSchema");
const Agent = require("../model/agentSchema");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const moment = require("moment-timezone");

const bookingHelper = {

  // Add this function to calculate total prizes
  calculateTotalPrizesWorkaround: async (matchConditions) => {
    try {
      // 1. Get all bookings with won tickets
      const bookings = await Booking.find({
        ...matchConditions,
        "tickets.isWon": true
      }).lean();

      let totalPrizes = 0;

      // 2. Process each booking
      for (const booking of bookings) {
        for (const ticket of booking.tickets) {
          if (ticket.isWon) {
            // 3. Get the lottery to find prize amount
            const lottery = await Lottery.findById(ticket.lottery.id).lean();

            if (lottery && lottery.winners) {
              // 4. Find this ticket in lottery winners to get prizeRank
              for (const winner of lottery.winners) {
                //  for (let i = lottery.winners.length - 1; i >= 0; i--){
                //   const winner = lottery.winners[i]; // Get the winner element
                if (winner._id === ticket.lottery.timeId) {
                  const winNumber = winner.winNumbers.find(
                    wn => wn.ticketNumber === ticket.number
                  );

                  if (winNumber && winNumber.prizeRank) {
                    // 5. Find prize amount for this rank
                    const prize = lottery.prizes.find(
                      p => p.rank === winNumber.prizeRank
                    );

                    if (prize) {
                      // 6. Add to total (prize amount × quantity)
                      totalPrizes += prize.amount * ticket.quantity;
                    }
                  }
                  break;
                }
              }
            }
          }
        }
      }

      return totalPrizes;
    } catch (error) {
      console.error('Error calculating total prizes:', error);
      return 0;
    }
  },
  // Get bookings with filters, sorting, and pagination + KPIs
  getBookingsWithFilters: async (queryParams) => {
    try {
      let {
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
          fromDateTime = moment.tz(fromDateTime, 'Asia/Dubai');
          matchConditions["booking.date"].$gte = new Date(fromDateTime);
        }
        if (toDateTime) {
          toDateTime = moment.tz(toDateTime, 'Asia/Dubai');
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
        if (status === "ALL") {
          // If status is ALL, we don't need to filter by status
        }
        else if (status === "PAID" || status === "UNPAID" || status === "IN_AGENT")
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

            // KPI calculations based on filtered data - FIXED VERSION
            kpiData: [
              {
                $group: {
                  _id: null,
                  // Total number of bookings (totalTickets) - KEEP SAME NAME
                  totalTickets: { $sum: 1 },

                  // Total number of individual ticket entries across all bookings - KEEP SAME NAME
                  totalTicketNumbers: { $sum: "$financial.quantity" }, //{ $sum: { $size: "$tickets" } },


                  // ADDED: Total quantity of tickets (sum of all ticket quantities) - NEW FIELD
                  totalTicketQuantity: { $sum: "$financial.quantity" },

                  // Total revenue from all bookings
                  totalRevenue: { $sum: "$financial.totalAmount" },

                  // Total won ticket numbers - NOW CALCULATES QUANTITY INSTEAD OF ENTRIES
                  totalWonTicketNumbers: {
                    $sum: {
                      $reduce: {
                        input: "$tickets",
                        initialValue: 0,
                        in: {
                          $add: [
                            "$$value",
                            { $cond: [{ $eq: ["$$this.isWon", true] }, "$$this.quantity", 0] }
                          ]
                        }
                      }
                    }
                  },

                  // ADDED: Total won ticket entries (count of entries where isWon = true) - NEW FIELD
                  totalWonTicketEntries: {
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
        // ADDED: Total ticket quantity
        totalTicketQuantity: kpiData.totalTicketQuantity || 0,
        totalRevenue: parseFloat((kpiData.totalRevenue || 0).toFixed(2)),
        totalWonTicketNumbers: kpiData.totalWonTicketNumbers || 0,
        // ADDED: Total won ticket entries
        totalWonTicketEntries: kpiData.totalWonTicketEntries || 0,

        // Additional KPIs for better insights
        totalActiveBookings: kpiData.totalActiveBookings || 0,
        totalCancelledBookings: kpiData.totalCancelledBookings || 0,
        averageBookingValue: parseFloat((kpiData.averageBookingValue || 0).toFixed(2)),
        totalSubtotal: parseFloat((kpiData.totalSubtotal || 0).toFixed(2)),
        totalTax: parseFloat((kpiData.totalTax || 0).toFixed(2)),

        // Calculated metrics - UPDATED winRate calculation to use quantity
        winRate: kpiData.totalTicketQuantity > 0
          ? parseFloat(((kpiData.totalWonTicketNumbers / kpiData.totalTicketQuantity) * 100).toFixed(2))
          : 0,
        cancelRate: kpiData.totalTickets > 0
          ? parseFloat(((kpiData.totalCancelledBookings / kpiData.totalTickets) * 100).toFixed(2))
          : 0
      };

      const totalPrizes = await bookingHelper.calculateTotalPrizesWorkaround(matchConditions) || null
      if (typeof totalPrizes === 'number' && !isNaN(totalPrizes)) {
        // If it's a valid number, perform the formatting
        kpi.totalPrizes = parseFloat(totalPrizes.toFixed(2));
      } else {
        // If it's null, undefined, or invalid, set it to a safe default (like 0)
        // This prevents the application from crashing.
        kpi.totalPrizes = 0.00;
      }
      let ticketNumbersData = await bookingHelper.getTicketLevelData(queryParams) || null



      return {
        success: true,
        bookings: bookings,
        pagination: {
          currentPage: pageNumber,
          totalPages: totalPages,
          totalItems: totalItems,
          itemsPerPage: limitNumber
        },
        kpi: kpi,
        ticketLevelData: ticketNumbersData || null
      };

    } catch (error) {
      console.error('Error in getBookingsWithFilters:', error);
      throw error;
    }
  },

  getTicketLevelData: async (queryParams) => {
    try {
      console.log('\n=== DEBUG getTicketLevelData START ===');
      console.log('Query Params:', JSON.stringify(queryParams, null, 2));

      let {
        page = 1,
        limit = 25,
        customerSearch,
        fromDateTime,
        toDateTime,
        childLotteryId,
        agentId,
        status,
        sort = 'booking.date_desc',
        win,
        prizeType = 'All' // NEW: Add prizeType parameter
      } = queryParams;

      // Build match conditions
      const matchConditions = {};

      // IMPORTANT: Start with minimal filters for debugging
      console.log('\n--- Building Filters ---');
      console.log('Prize Type filter:', prizeType);

      // Customer search__ No Need of this searcch
      // if (customerSearch && customerSearch.trim()) {
      //   matchConditions.$or = [
      //     { "customer.name": { $regex: customerSearch.trim(), $options: 'i' } },
      //     { "customer.phone": { $regex: customerSearch.trim(), $options: 'i' } }
      //   ];
      //   console.log('Customer filter added');
      // }

      // Date range filter
      if (fromDateTime || toDateTime) {
        matchConditions["booking.date"] = {};
        if (fromDateTime) {
          fromDateTime = moment.tz(fromDateTime, 'Asia/Dubai');
          matchConditions["booking.date"].$gte = new Date(fromDateTime);
          console.log('From date filter:', fromDateTime);
        }
        if (toDateTime) {
          toDateTime = moment.tz(toDateTime, 'Asia/Dubai');
          matchConditions["booking.date"].$lte = new Date(toDateTime);
          console.log('To date filter:', toDateTime);
        }
      }

      // Child lottery filter
      if (childLotteryId && childLotteryId.trim()) {
        matchConditions["tickets.lottery.timeId"] = childLotteryId;
        console.log('Child lottery filter:', childLotteryId);
      }

      // Agent filter
      if (agentId && agentId.trim()) {
        matchConditions["agent.id"] = new mongoose.Types.ObjectId(agentId);
        console.log('Agent filter:', agentId);
      }

      console.log('Final matchConditions:', JSON.stringify(matchConditions, null, 2));

      // Build sort conditions - will be overridden for prizeType = "All"
      const [sortField, sortDirection] = sort.split('_');
      let sortConditions = {};

      switch (sortField) {
        case 'ticket.number':
          sortConditions["_id.number"] = sortDirection === 'desc' ? -1 : 1;
          break;
        case 'ticket.type':
          sortConditions["_id.type"] = sortDirection === 'desc' ? -1 : 1;
          break;
        case 'ticket.quantity':
          sortConditions["totalQuantity"] = sortDirection === 'desc' ? -1 : 1;
          break;
        default:
          sortConditions["_id.number"] = 1; // Default
      }

      // Pagination
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;

      console.log('\n--- Building Pipeline ---');

      // CRITICAL FIX: Build ticket-level match separately
      const ticketLevelMatch = {};

      // Status filter at ticket level
      if (status && status.trim() && status !== "ALL") {
        if (status === "NOT_WINNER") {
          ticketLevelMatch["tickets.status"] = "NOT_WINNER";
        } else if (["PAID", "UNPAID", "IN_AGENT"].includes(status)) {
          ticketLevelMatch["tickets.status"] = status;
        }
        console.log('Status filter (ticket level):', status);
      }

      // Win filter at ticket level
      if (win && win.trim()) {
        if (win === "WON") {
          ticketLevelMatch["tickets.isWon"] = true;
        } else if (win === "NOT_WON") {
          ticketLevelMatch["tickets.isWon"] = false;
        }
        console.log('Win filter (ticket level):', win);
      }

      // Prize Type filter at ticket level
      if (prizeType !== 'All') {
        const typeMap = {
          'Prize1': 1, // Letter+Number
          'Prize2': 2, // 2-digit
          'Prize3': 3, // 3-digit
          'Prize4': 4, // 4-digit
          'Prize5': 5  // 5-digit
        };

        if (typeMap[prizeType]) {
          ticketLevelMatch["tickets.type"] = typeMap[prizeType];
          console.log('Prize Type filter (ticket level):', prizeType, '-> type', typeMap[prizeType]);
        }
      }

      console.log('Ticket level match:', JSON.stringify(ticketLevelMatch, null, 2));

      // CORRECTED PIPELINE with prizeType sorting
      const pipeline = [
        // STAGE 1: Match at booking level only
        { $match: matchConditions },

        // STAGE 2: Unwind to get individual tickets
        { $unwind: "$tickets" },

        // STAGE 3: Match at ticket level (status, win, prizeType)
        ...(Object.keys(ticketLevelMatch).length > 0 ? [{ $match: ticketLevelMatch }] : []),

        // STAGE 4: Add fields for custom sorting when prizeType = "All"
        {
          $addFields: {
            // Extract first character for Type 1 tickets (Letter+Number)
            firstChar: {
              $cond: [
                { $eq: ["$tickets.type", 1] }, // Only for Type 1 tickets
                { $substr: ["$tickets.number", 0, 1] }, // Get first character
                "" // Empty string for other types
              ]
            },
            // Custom sort order for Type 1 tickets: A-E first, then others
            type1SortOrder: {
              $cond: [
                { $eq: ["$tickets.type", 1] },
                {
                  $switch: {
                    branches: [
                      { case: { $eq: ["$firstChar", "A"] }, then: 1 },
                      { case: { $eq: ["$firstChar", "B"] }, then: 2 },
                      { case: { $eq: ["$firstChar", "C"] }, then: 3 },
                      { case: { $eq: ["$firstChar", "D"] }, then: 4 },
                      { case: { $eq: ["$firstChar", "E"] }, then: 5 }
                    ],
                    default: 6 // Other letters come after A-E
                  }
                },
                0 // Not Type 1
              ]
            },
            // Custom type order: 1, 5, 4, 3, 2
            customTypeOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ["$tickets.type", 1] }, then: 1 }, // Type 1 first
                  { case: { $eq: ["$tickets.type", 5] }, then: 2 }, // Type 5 second
                  { case: { $eq: ["$tickets.type", 4] }, then: 3 }, // Type 4 third
                  { case: { $eq: ["$tickets.type", 3] }, then: 4 }, // Type 3 fourth
                  { case: { $eq: ["$tickets.type", 2] }, then: 5 }  // Type 2 fifth
                ],
                default: 6 // Any other type
              }
            }
          }
        },

        // STAGE 5: Group by ticket number + type
        {
          $group: {
            _id: {
              number: "$tickets.number",
              type: "$tickets.type"
            },
            totalQuantity: { $sum: "$tickets.quantity" },
            customTypeOrder: { $first: "$customTypeOrder" },
            type1SortOrder: { $first: "$type1SortOrder" },
            firstChar: { $first: "$firstChar" },

            // Collect all relevant data for first occurrence
            firstOccurrence: {
              $first: {
                ticketNumber: "$ticketNumber",
                customer: "$customer",
                agent: "$agent",
                booking: "$booking",
                tickets: "$tickets"
              }
            },

            // For KPI - check if ANY occurrence is won
            anyIsWon: { $max: { $cond: [{ $eq: ["$tickets.isWon", true] }, 1, 0] } },
            anyStatus: { $first: "$tickets.status" },

            // Count bookings for this ticket
            bookingCount: { $sum: 1 }
          }
        },

        // STAGE 6: Add isWon field based on any occurrence
        {
          $addFields: {
            isWon: { $eq: ["$anyIsWon", 1] }
          }
        }
      ];

      // Determine sorting based on prizeType
      if (prizeType === 'All') {
        // Custom sort for "All": Type 1 → Type 5 → Type 4 → Type 3 → Type 2
        // Within Type 1: A, B, C, D, E first, then other letters
        pipeline.push({
          $sort: {
            customTypeOrder: 1,      // Type order: 1, 5, 4, 3, 2
            type1SortOrder: 1,       // Within Type 1: A(1), B(2), C(3), D(4), E(5), others(6)
            "_id.number": 1          // Then by ticket number
          }
        });
      } else {
        // Use original sort for specific prize types
        pipeline.push({ $sort: sortConditions });
      }

      // Add facet stage for pagination and KPIs
      pipeline.push({
        $facet: {
          // Paginated tickets
          tickets: [
            { $skip: skip },
            { $limit: limitNumber },
            {
              $project: {
                ticketNumber: "$_id.number",
                totalQuantity: 1,
                type: "$_id.type",

                // Info from first occurrence
                bookingTicketNumber: "$firstOccurrence.ticketNumber",
                customerName: "$firstOccurrence.customer.name",
                agentName: "$firstOccurrence.agent.name",
                bookingDate: "$firstOccurrence.booking.date",
                status: "$anyStatus",
                isWon: 1,
                lotteryName: "$firstOccurrence.tickets.lottery.name",
                timeId: "$firstOccurrence.tickets.lottery.timeId",
                bookingCount: 1
              }
            }
          ],

          // Total count
          totalCount: [
            { $count: "count" }
          ],

          // KPI by type
          kpiByType: [
            {
              $group: {
                _id: "$_id.type",
                totalQuantity: { $sum: "$totalQuantity" },
                totalUniqueTickets: { $sum: 1 },
                totalWonQuantity: {
                  $sum: {
                    $cond: [{ $eq: ["$isWon", true] }, "$totalQuantity", 0]
                  }
                },
                totalWonUniqueTickets: {
                  $sum: {
                    $cond: [{ $eq: ["$isWon", true] }, 1, 0]
                  }
                }
              }
            },
            { $sort: { _id: 1 } }
          ]
        }
      });

      console.log('\n--- Executing Pipeline ---');
      console.log('Pipeline length:', pipeline.length);

      const result = await Booking.aggregate(pipeline);

      console.log('\n--- Pipeline Results ---');
      console.log('Tickets found:', result[0]?.tickets?.length || 0);
      console.log('Total items:', result[0]?.totalCount[0]?.count || 0);

      if (result[0]?.tickets?.length > 0) {
        console.log('First 10 tickets (showing sorting):');
        result[0].tickets.slice(0, 10).forEach((ticket, i) => {
          console.log(`${i + 1}. ${ticket.ticketNumber} - Type: ${ticket.type}, Qty: ${ticket.totalQuantity}, Won: ${ticket.isWon}`);
        });
      }

      const tickets = result[0].tickets || [];
      const totalItems = result[0].totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalItems / limitNumber);
      const kpiByTypeRaw = result[0].kpiByType || [];

      // Initialize KPI (EXACT SAME STRUCTURE AS ORIGINAL)
      const kpiByType = {
        type1: { totalQuantity: 0, totalUniqueTickets: 0, totalWonQuantity: 0, totalWonUniqueTickets: 0 },
        type2: { totalQuantity: 0, totalUniqueTickets: 0, totalWonQuantity: 0, totalWonUniqueTickets: 0 },
        type3: { totalQuantity: 0, totalUniqueTickets: 0, totalWonQuantity: 0, totalWonUniqueTickets: 0 },
        type4: { totalQuantity: 0, totalUniqueTickets: 0, totalWonQuantity: 0, totalWonUniqueTickets: 0 },
        type5: { totalQuantity: 0, totalUniqueTickets: 0, totalWonQuantity: 0, totalWonUniqueTickets: 0 },
        total: { totalQuantity: 0, totalUniqueTickets: 0, totalWonQuantity: 0, totalWonUniqueTickets: 0 }
      };

      // Fill KPI (EXACT SAME LOGIC AS ORIGINAL)
      kpiByTypeRaw.forEach(item => {
        const typeKey = `type${item._id}`;
        if (kpiByType[typeKey]) {
          kpiByType[typeKey] = {
            totalQuantity: item.totalQuantity || 0,
            totalUniqueTickets: item.totalUniqueTickets || 0,
            totalWonQuantity: item.totalWonQuantity || 0,
            totalWonUniqueTickets: item.totalWonUniqueTickets || 0,
            winRateQuantity: item.totalQuantity > 0
              ? parseFloat(((item.totalWonQuantity / item.totalQuantity) * 100).toFixed(2))
              : 0,
            winRateTickets: item.totalUniqueTickets > 0
              ? parseFloat(((item.totalWonUniqueTickets / item.totalUniqueTickets) * 100).toFixed(2))
              : 0
          };

          // Add to totals
          kpiByType.total.totalQuantity += item.totalQuantity || 0;
          kpiByType.total.totalUniqueTickets += item.totalUniqueTickets || 0;
          kpiByType.total.totalWonQuantity += item.totalWonQuantity || 0;
          kpiByType.total.totalWonUniqueTickets += item.totalWonUniqueTickets || 0;
        }
      });

      // Calculate total win rates (EXACT SAME LOGIC AS ORIGINAL)
      kpiByType.total.winRateQuantity = kpiByType.total.totalQuantity > 0
        ? parseFloat(((kpiByType.total.totalWonQuantity / kpiByType.total.totalQuantity) * 100).toFixed(2))
        : 0;

      kpiByType.total.winRateTickets = kpiByType.total.totalUniqueTickets > 0
        ? parseFloat(((kpiByType.total.totalWonUniqueTickets / kpiByType.total.totalUniqueTickets) * 100).toFixed(2))
        : 0;

      console.log('\n--- Final Results ---');
      console.log('Returning tickets:', tickets.length);
      console.log('KPI by type:', JSON.stringify(kpiByType, null, 2));
      console.log('=== DEBUG getTicketLevelData END ===\n');

      // Return EXACT SAME STRUCTURE as original
      return {
        success: true,
        tickets: tickets,
        pagination: {
          currentPage: pageNumber,
          totalPages: totalPages,
          totalItems: totalItems,
          itemsPerPage: limitNumber
        },
        kpi: {
          byType: kpiByType
        }
      };

    } catch (error) {
      console.error('Error in getTicketLevelData:', error);
      console.error('Error stack:', error.stack);
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
  updateBookingStatus1: async (req, res) => {
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
  // Helper functions (same as before)
  getBulkStatusChangeReason: (newStatus, ticket) => {
    const reasons = {
      'PAID': `Prize payment processed for winning ticket ${ticket.number}`,
      'UNPAID': `Bulk status reset to UNPAID`,
      'NOT_WINNER': `Bulk update to NOT_WINNER from lottery results`
    };
    return reasons[newStatus] || `Bulk status update to ${newStatus}`;
  },

  getBulkSuccessMessage: function (newStatus, updatedCount, totalCount) {
    const messages = {
      'PAID': `Successfully paid ${updatedCount} winning ticket(s) out of ${totalCount} total tickets`,
      'UNPAID': `Reset ${updatedCount} ticket(s) to UNPAID status`,
      'NOT_WINNER': `Marked ${updatedCount} ticket(s) as NOT_WINNER`
    };
    return messages[newStatus] || `Updated ${updatedCount} ticket(s) to ${newStatus}`;
  },
  updateBookingStatus: async function (req, res) {
    try {
      // const { bookingId, newStatus } = req.body;
      let newStatus = req.body.status;
      let bookingId = req.params.id;
      const adminId = req.session.admin?.id || req.user?.id;

      // Validate inputs
      // if (!bookingId || !newStatus || !adminId) {
      //   return res.status(400).json({
      //     success: false,
      //     message: 'Booking ID, new status, and admin authentication are required'
      //   });
      // }

      if (!['PAID', 'UNPAID', 'NOT_WINNER'].includes(newStatus)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be PAID, UNPAID, or NOT_WINNER'
        });
      }

      // Find the booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // 🛡️ Validate the bulk status change
      if (newStatus === 'PAID') {
        // Check if there are any winning tickets to pay
        const hasWinningTickets = booking.tickets.some(ticket => ticket.isWon);
        if (!hasWinningTickets) {
          return res.status(400).json({
            success: false,
            message: 'No winning tickets found in this booking to mark as PAID'
          });
        }

        // Check if all winning tickets are eligible for payment
        const ineligibleTickets = booking.tickets.filter(ticket =>
          ticket.isWon && ticket.status === 'NOT_WINNER'
        );
        if (ineligibleTickets.length > 0) {
          const ticketNumbers = ineligibleTickets.map(t => t.number).join(', ');
          return res.status(400).json({
            success: false,
            message: `Cannot pay NOT_WINNER tickets: ${ticketNumbers}`
          });
        }
      }

      // Prepare bulk update operations for ALL tickets
      const updateOperations = [];
      const currentTime = new Date();

      for (let i = 0; i < booking.tickets.length; i++) {
        const ticket = booking.tickets[i];

        // 🛡️ Individual ticket validation for PAID status
        if (newStatus === 'PAID') {
          // Only mark winning tickets as PAID, skip non-winning ones
          if (!ticket.isWon) {
            console.log(`⏭️ Skipping non-winning ticket: ${ticket.number}`);
            continue;
          }

          // Skip tickets that are already NOT_WINNER
          if (ticket.status === 'NOT_WINNER') {
            console.log(`⏭️ Skipping NOT_WINNER ticket: ${ticket.number}`);
            continue;
          }
        }

        // For UNPAID and NOT_WINNER, update all tickets
        const updateOperation = {
          updateOne: {
            filter: {
              _id: bookingId,
              [`tickets.${i}.number`]: ticket.number
            },
            update: {
              $set: {
                [`tickets.${i}.status`]: newStatus,
                updatedAt: currentTime
              },
              $push: {
                [`tickets.${i}.statusHistory`]: {
                  status: newStatus,
                  changedAt: currentTime,
                  changedBy: adminId,
                  reason: this.getBulkStatusChangeReason(newStatus, ticket)
                }
              }
            }
          }
        };

        updateOperations.push(updateOperation);
      }

      if (updateOperations.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No eligible tickets found for status update'
        });
      }

      // Perform bulk update
      const updateResult = await Booking.bulkWrite(updateOperations);

      // Get updated booking with details
      const updatedBooking = await Booking.findById(bookingId);
      const ticketObj = updatedBooking.toObject();
      ticketObj.displayId = `TKT-${updatedBooking.ticketNumber}`;

      // Generate success message with statistics
      const updatedTickets = updatedBooking.tickets.filter(t =>
        updateOperations.some(op =>
          op.updateOne.filter[`tickets.${updatedBooking.tickets.indexOf(t)}.number`] === t.number
        )
      );

      const successMessage = this.getBulkSuccessMessage(newStatus, updatedTickets.length, booking.tickets.length);

      return res.status(200).json({
        success: true,
        message: successMessage,
        data: ticketObj,
        stats: {
          totalTickets: booking.tickets.length,
          updatedTickets: updatedTickets.length,
          skippedTickets: booking.tickets.length - updatedTickets.length
        }
      });

    } catch (error) {
      console.error('Error in updateBookingStatus:', error);
      return res.status(500).json({
        success: false,
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
      console.log('Child Lotteries:\n', childLotteries);
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
  checkTicketExistence: async (req, res) => {
    try {
      const { lotteryId, timeId, number } = req.body;
      if (!lotteryId || !timeId || !number) {
        return res.status(400).json({
          "exists": false,
          "success": false,
          "message": "lotteryId, timeId, and Ticket number are required",
        });
      }

      const existingTicket = await Booking.findOne(
        {
          'tickets.lottery.id': lotteryId,
          'tickets.lottery.timeId': timeId,
          'tickets.number': number
        }
      );
      if (existingTicket) {
        return res.status(200).json({
          "exists": true,
          "success": true,
          "message": "Ticket number exist",
        });
      }

      return res.status(200).json({
        "exists": false,
        "success": true,
        "message": "Ticket number does not exist",
      });

    } catch (error) {
      console.error('Error in checkTicketExistence:', error);
      res.status(500).json({
        "exists": false,
        "success": false,
        "message": "Error checking ticket existence",
      });
    }
  },

  // Create new booking
  createBookingOrg: async (bookingData, req, res) => {
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
          name: req.session.admin.name || 'NA',
          id: req.session.admin.id || null,
          phone: req.session.admin.phone || 'NA',
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

  // Create new booking
  createBookingjj: async (bookingData, req, res) => {
    try {
      // Validate required fields
      if (!bookingData.customer || !bookingData.customer.name || !bookingData.customer.phone) {
        return res.status(400).json({
          success: false,
          message: "Customer name and phone are required",
          data: null
        });
      }

      if (!bookingData.tickets || !Array.isArray(bookingData.tickets) || bookingData.tickets.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one ticket is required",
          data: null
        });
      }

      // Generate unique ticket number
      const ticketNumber = await bookingHelper.generateUniqueTicketNumber();

      // Process tickets with validation
      const processedTickets = [];
      let subtotal = 0;
      let validationErrors = [];

      for (const [index, ticket] of bookingData.tickets.entries()) {
        try {
          // Validate required ticket fields
          if (!ticket.number || !ticket.type || !ticket.lottery || !ticket.lottery.id) {
            validationErrors.push(`Ticket ${index + 1}: Number, type, and lottery ID are required`);
            continue;
          }

          // Validate ticket type
          if (ticket.type < 1 || ticket.type > 5) {
            validationErrors.push(`Ticket ${index + 1}: Invalid ticket type ${ticket.type}. Must be 1-5`);
            continue;
          }

          // Get lottery
          const lottery = await Lottery.findById(ticket.lottery.id);
          if (!lottery) {
            validationErrors.push(`Ticket ${index + 1}: Lottery not found: ${ticket.lottery.id}`);
            continue;
          }

          // Get ticket charge for this type
          const chargeRecord = await ticketCharge.findOne({ ticketType: ticket.type });
          if (!chargeRecord) {
            validationErrors.push(`Ticket ${index + 1}: No price found for type ${ticket.type}`);
            continue;
          }

          // Validate timeId (draw time)
          let timeId = ticket.lottery.timeId || 'main';
          let drawDate = lottery.drawDate; // Default to parent lottery draw date

          if (timeId !== 'main') {
            const childLottery = lottery.winners.find(w => w._id.toString() === timeId.toString());
            if (!childLottery) {
              validationErrors.push(`Ticket ${index + 1}: Draw time not found: ${timeId}`);
              continue;
            }
            drawDate = childLottery.resultTime || drawDate;
          }

          // // Check for duplicate ticket in database
          // const existingTicket = await Booking.findOne({
          //   'tickets.lottery.id': lottery._id,
          //   'tickets.lottery.timeId': timeId,
          //   'tickets.number': ticket.number,
          //   'tickets.type': ticket.type
          // });

          // if (existingTicket) {
          //   validationErrors.push(`Ticket "${ticket.number}" (Type ${ticket.type}) already exists for this lottery`);
          //   continue;
          // }

          // Create ticket entries based on quantity
          const quantity = ticket.quantity || 1;
          if (quantity < 1 || quantity > 99) {
            validationErrors.push(`Ticket ${index + 1}: Quantity must be 1-99`);
            continue;
          }

          for (let i = 0; i < quantity; i++) {
            const uniqueNumberId = `${ticket.number}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}-${i}`;

            processedTickets.push({
              lottery: {
                id: lottery._id,
                name: lottery.name,
                drawNumber: lottery.drawNumber,
                drawDate: drawDate,
                timeId: timeId
              },
              numberId: uniqueNumberId,
              isWon: false,
              number: ticket.number,
              type: ticket.type,
              quantity: 1, // Each entry is quantity 1
              chargeAmount: chargeRecord.chargeAmount,
              status: "NOT_WINNER"
            });

            subtotal += chargeRecord.chargeAmount;
          }
        } catch (error) {
          validationErrors.push(`Ticket ${index + 1}: ${error.message}`);
        }
      }

      // Check for validation errors
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Ticket validation failed",
          errors: validationErrors,
          data: null
        });
      }

      if (processedTickets.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid tickets to book",
          data: null
        });
      }

      // Get agent info from session
      const agent = {
        name: req.session?.admin?.name || 'NA',
        id: req.session?.admin?.id || null,
        phone: req.session?.admin?.phone || 'N/A',
        role: req.session?.admin?.role || ['admin']
      };

      // Create booking object
      const newBooking = new Booking({
        ticketNumber: ticketNumber,
        customer: {
          name: bookingData.customer.name.trim(),
          phone: bookingData.customer.phone.trim()
        },
        agent: agent,
        booking: {
          date: new Date(),
          status: 'active'
        },
        tickets: processedTickets,
        financial: {
          quantity: processedTickets.reduce((accumulator, ticketItem) => {
            return accumulator + ticketItem.quantity;
          }, 0),
          subtotal: subtotal,
          tax: 0,
          totalAmount: subtotal,
          currency: "NU"
        },
        payment: bookingData.payment || {
          method: 'cash',
          status: 'paid',
          reference: `PAY-${Date.now()}`
        }
      });

      // Save booking
      const savedBooking = await newBooking.save();

      // Add displayId virtual field
      const bookingObj = savedBooking.toObject();
      bookingObj.displayId = `TKT-${savedBooking.ticketNumber}`;

      return res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: {
          ticketNumber: savedBooking.ticketNumber,
          displayId: bookingObj.displayId,
          customer: savedBooking.customer,
          totalAmount: savedBooking.financial.totalAmount,
          totalTickets: processedTickets.length,
          bookingDate: savedBooking.booking.date
        }
      });

    } catch (error) {
      console.error('Error in createBooking:', error);

      // Handle specific error types
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors,
          data: null
        });
      }

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Duplicate ticket number detected",
          data: null
        });
      }

      return res.status(500).json({
        success: false,
        message: "An error occurred while creating booking",
        data: null,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  createBookingLast: async (bookingData, req, res) => {
    try {
      // Validate required fields
      if (!bookingData.customer || !bookingData.customer.name || !bookingData.customer.phone) {
        return res.status(400).json({
          success: false,
          message: "Customer name and phone are required",
          data: null
        });
      }

      if (!bookingData.tickets || !Array.isArray(bookingData.tickets) || bookingData.tickets.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one ticket is required",
          data: null
        });
      }

      // Generate unique ticket number
      const ticketNumber = await bookingHelper.generateUniqueTicketNumber();

      // Process tickets with validation
      const processedTickets = [];
      let subtotal = 0;
      let totalQuantity = 0;
      let validationErrors = [];

      for (const [index, ticket] of bookingData.tickets.entries()) {
        try {
          // Validate required ticket fields
          if (!ticket.number || !ticket.type || !ticket.lottery || !ticket.lottery.id) {
            validationErrors.push(`Ticket ${index + 1}: Number, type, and lottery ID are required`);
            continue;
          }

          // Validate ticket type
          if (ticket.type < 1 || ticket.type > 5) {
            validationErrors.push(`Ticket ${index + 1}: Invalid ticket type ${ticket.type}. Must be 1-5`);
            continue;
          }

          // Get lottery
          const lottery = await Lottery.findById(ticket.lottery.id);
          if (!lottery) {
            validationErrors.push(`Ticket ${index + 1}: Lottery not found: ${ticket.lottery.id}`);
            continue;
          }

          // Get ticket charge for this type
          const chargeRecord = await ticketCharge.findOne({ ticketType: ticket.type });
          if (!chargeRecord) {
            validationErrors.push(`Ticket ${index + 1}: No price found for type ${ticket.type}`);
            continue;
          }

          // Validate timeId (draw time)
          let timeId = ticket.lottery.timeId || 'main';
          let drawDate = lottery.drawDate; // Default to parent lottery draw date

          if (timeId !== 'main') {
            const childLottery = lottery.winners.find(w => w._id.toString() === timeId.toString());
            if (!childLottery) {
              validationErrors.push(`Ticket ${index + 1}: Draw time not found: ${timeId}`);
              continue;
            }
            drawDate = childLottery.resultTime || drawDate;
          }

          // Validate quantity
          const quantity = ticket.quantity || 1;
          if (quantity < 1 || quantity > 99) {
            validationErrors.push(`Ticket ${index + 1}: Quantity must be 1-99`);
            continue;
          }

          // Generate unique numberId for this ticket entry
          const uniqueNumberId = `${ticket.number}-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

          // Create single ticket entry with quantity
          processedTickets.push({
            lottery: {
              id: lottery._id,
              name: lottery.name,
              drawNumber: lottery.drawNumber,
              drawDate: drawDate,
              timeId: timeId
            },
            numberId: uniqueNumberId,
            isWon: false,
            number: ticket.number,
            type: ticket.type,
            quantity: quantity, // Single entry with quantity field
            chargeAmount: chargeRecord.chargeAmount * quantity,
            status: "NOT_WINNER"
          });

          // Calculate total price for this ticket (price × quantity)
          const ticketTotal = chargeRecord.chargeAmount * quantity;
          subtotal += ticketTotal;
          totalQuantity += quantity;

        } catch (error) {
          validationErrors.push(`Ticket ${index + 1}: ${error.message}`);
        }
      }

      // Check for validation errors
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Ticket validation failed",
          errors: validationErrors,
          data: null
        });
      }

      if (processedTickets.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid tickets to book",
          data: null
        });
      }

      // Get agent info from session
      const agent = {
        name: req.session?.admin?.name || 'NA',
        id: req.session?.admin?.id || null,
        phone: req.session?.admin?.phone || 'N/A',
        role: req.session?.admin?.role || ['admin']
      };

      // Create booking object
      const newBooking = new Booking({
        ticketNumber: ticketNumber,
        customer: {
          name: bookingData.customer.name.trim(),
          phone: bookingData.customer.phone.trim()
        },
        agent: agent,
        booking: {
          date: new Date(),
          status: 'active'
        },
        tickets: processedTickets,
        financial: {
          quantity: processedTickets.reduce((acc, ticket) => acc + ticket.quantity, 0), // Total quantity across all tickets
          subtotal: subtotal,
          tax: 0,
          totalAmount: subtotal,
          currency: "NU"
        },
        payment: bookingData.payment || {
          method: 'cash',
          status: 'paid',
          reference: `PAY-${Date.now()}`
        }
      });

      // Save booking
      const savedBooking = await newBooking.save();

      // Add displayId virtual field
      const bookingObj = savedBooking.toObject();
      bookingObj.displayId = `TKT-${savedBooking.ticketNumber}`;

      return res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: {
          ticketNumber: savedBooking.ticketNumber,
          displayId: bookingObj.displayId,
          customer: savedBooking.customer,
          totalAmount: savedBooking.financial.totalAmount,
          totalTickets: processedTickets.length, // Number of unique ticket entries
          totalQuantity: savedBooking.financial.quantity, // Total quantity across all tickets
          bookingDate: savedBooking.booking.date
        }
      });

    } catch (error) {
      console.error('Error in createBooking:', error);

      // Handle specific error types
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors,
          data: null
        });
      }

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Duplicate ticket number detected",
          data: null
        });
      }

      return res.status(500).json({
        success: false,
        message: "An error occurred while creating booking",
        data: null,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  createBooking: async (bookingData, req, res) => {
    try {

      // Validate required fields
      if (!bookingData.customer || !bookingData.customer.name || !bookingData.customer.phone) {
        return res.status(400).json({
          success: false,
          message: "Customer name and phone are required",
          data: null
        });
      }

      if (!bookingData.tickets || !Array.isArray(bookingData.tickets) || bookingData.tickets.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one ticket is required",
          data: null
        });
      }

      // Generate unique ticket number
      const ticketNumber = await bookingHelper.generateUniqueTicketNumber();

      // Process tickets with validation
      const processedTickets = [];
      let subtotal = 0;
      let totalQuantity = 0;
      let validationErrors = [];

      for (const [index, ticket] of bookingData.tickets.entries()) {
        try {
          // Validate required ticket fields
          if (!ticket.number || !ticket.type || !ticket.lottery || !ticket.lottery.id) {
            validationErrors.push(`Ticket ${index + 1}: Number, type, and lottery ID are required`);
            continue;
          }

          // Validate ticket type
          if (ticket.type < 1 || ticket.type > 5) {
            validationErrors.push(`Ticket ${index + 1}: Invalid ticket type ${ticket.type}. Must be 1-5`);
            continue;
          }

          // Get lottery
          const lottery = await Lottery.findById(ticket.lottery.id);
          if (!lottery) {
            validationErrors.push(`Ticket ${index + 1}: Lottery not found: ${ticket.lottery.id}`);
            continue;
          }

          // Get ticket charge for this type
          const chargeRecord = await ticketCharge.findOne({ ticketType: ticket.type });
          if (!chargeRecord) {
            validationErrors.push(`Ticket ${index + 1}: No price found for type ${ticket.type}`);
            continue;
          }

          // Validate timeId (draw time)
          let timeId = ticket.lottery.timeId || 'main';
          let drawDate = lottery.drawDate; // Default to parent lottery draw date

          if (timeId !== 'main') {
            const childLottery = lottery.winners.find(w => w._id.toString() === timeId.toString());
            if (!childLottery) {
              validationErrors.push(`Ticket ${index + 1}: Draw time not found: ${timeId}`);
              continue;
            }
            drawDate = childLottery.resultTime || drawDate;
          }

          // Validate quantity
          const quantity = ticket.quantity || 1;
          if (quantity < 1 || quantity > 99) {
            validationErrors.push(`Ticket ${index + 1}: Quantity must be 1-99`);
            continue;
          }

          // Generate unique numberId for this ticket entry
          const uniqueNumberId = `${ticket.number}-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

          // Calculate total charge for this ticket entry (per-ticket price × quantity)
          const singleTicketCharge = chargeRecord.chargeAmount;
          const totalTicketCharge = singleTicketCharge * quantity;

          // Create single ticket entry with quantity
          processedTickets.push({
            lottery: {
              id: lottery._id,
              name: lottery.name,
              drawNumber: lottery.drawNumber,
              drawDate: drawDate,
              timeId: timeId
            },
            numberId: uniqueNumberId,
            isWon: false,
            number: ticket.number,
            type: ticket.type,
            quantity: quantity, // Quantity for this ticket entry
            chargeAmount: totalTicketCharge, // TOTAL charge for this ticket entry (quantity × per-ticket price)
            status: "NOT_WINNER"
          });

          // Add to totals
          subtotal += totalTicketCharge;
          totalQuantity += quantity;

        } catch (error) {
          validationErrors.push(`Ticket ${index + 1}: ${error.message}`);
        }
      }

      // Check for validation errors
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Ticket validation failed",
          errors: validationErrors,
          data: null
        });
      }

      if (processedTickets.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid tickets to book",
          data: null
        });
      }

      // Get agent info from session
      const agent = {
        name: req.session?.admin?.name || 'NA',
        id: req.session?.admin?.id || null,
        phone: req.session?.admin?.phone || 'N/A',
        role: req.session?.admin?.role || ['admin']
      };

      // Create booking object
      const newBooking = new Booking({
        ticketNumber: ticketNumber,
        customer: {
          name: bookingData.customer.name.trim(),
          phone: bookingData.customer.phone.trim()
        },
        agent: agent,
        booking: {
          date: new Date(),
          status: 'active'
        },
        tickets: processedTickets,
        financial: {
          quantity: totalQuantity, // Total quantity (sum of all ticket quantities)
          subtotal: subtotal,
          tax: 0,
          totalAmount: subtotal,
          currency: "NU"
        },
        payment: bookingData.payment || {
          method: 'cash',
          status: 'paid',
          reference: `PAY-${Date.now()}`
        }
      });

      console.log('Booking data:\n', bookingData);
      console.log('Tickets data:\n', bookingData.tickets);
      console.log('processedTickets Before saving the book :\n', processedTickets)
      // Save booking
      const savedBooking = await newBooking.save();
      console.log('Saved Booking:\n', savedBooking);

      // Add displayId virtual field
      const bookingObj = savedBooking.toObject();
      bookingObj.displayId = `TKT-${savedBooking.ticketNumber}`;

      return res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: {
          ticketNumber: savedBooking.ticketNumber,
          displayId: bookingObj.displayId,
          customer: savedBooking.customer,
          totalAmount: savedBooking.financial.totalAmount,
          totalTickets: processedTickets.length, // Number of unique ticket entries
          totalQuantity: savedBooking.financial.quantity, // Total quantity across all tickets
          bookingDate: savedBooking.booking.date
        }
      });

    } catch (error) {
      console.error('Error in createBooking:', error);

      // Handle specific error types
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors,
          data: null
        });
      }

      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Duplicate ticket number detected",
          data: null
        });
      }

      return res.status(500).json({
        success: false,
        message: "An error occurred while creating booking",
        data: null,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
  generateUniqueTicketNumberId: async () => {
    try {
      let isUnique = false;
      let ticketNumberId;

      while (!isUnique) {
        // Generate random 6-digit number
        const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        ticketNumberId = `NUMBER_ID_${randomNum}`;

        // Check if it already exists
        // const existingBooking = await Booking.findOne({ ticketNumberId: ticketNumberId });
        // if (!existingBooking) {
        //   isUnique = true;
        // }
      }

      return ticketNumberId;

    } catch (error) {
      console.error('Error in generateUniqueTicketNumberId:', error);
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

  deleteBooking: async (bookingId, req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new Error('Invalid booking ID format');
      }

      // Find and delete the booking document
      const booking = await Booking.findByIdAndDelete(bookingId);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        })
      }


      return res.status(200).json({
        success: true,
        message: "Booking deleted successfully"
      })

    } catch (error) {
      console.log(error)
      return res.status(502).json({
        success: false,
        message: 'An Err Occured'
      })
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