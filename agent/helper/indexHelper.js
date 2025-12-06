const Lottery = require("../model/lotterySchema"); // Your model
const Charge = require("../model/ticketChargeSchema"); // Your model
const ticketCharge = require("../model/ticketChargeSchema");
const Booking = require("../model/bookingsSchema"); // Your model
mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const moment = require("moment-timezone");

const indexHelper = {
  getLotteries: async (req, res) => {
    try {
      const allLotteries = await Lottery.find({});

      // Get Dubai's current date (00:00:00 of today)
      const today = moment().tz("Asia/Dubai").startOf("day");
      console.log("Today's date in Bhutan timezone:", today.toDate());
      const tomorrow = moment(today).add(1, "day");

      const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const todays = [];
      const upcoming = [];
      const past = [];

      allLotteries.forEach((lottery) => {
        const drawDate = moment(lottery.drawDate).tz("Asia/Dubai");
        const dayName = weekdays[drawDate.day()];
        const lotteryWithDay = { ...lottery._doc, dayName };

        if (drawDate.isSameOrAfter(today) && drawDate.isBefore(tomorrow)) {
          todays.push(lotteryWithDay);
        } else if (drawDate.isAfter(today)) {
          upcoming.push(lotteryWithDay);
        } else {
          past.push(lotteryWithDay);
        }
      });

      // Sort past by newest first and limit to 7
      past.sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate));
      const limitedPast = past.slice(0, 7);

      let filteredUpcoming = [];
      if (upcoming.length > 0) filteredUpcoming.push(upcoming[0]);

      return res.render("index", {
        todays,
        upcoming: filteredUpcoming,
        past: limitedPast,
        moment: moment,
        currentDateFromServer: today.toDate(),
      });
    } catch (err) {
      console.error("Error fetching lotteries:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "An error occurred while fetching lotteries.",
        });
    }
  },
  getPastLotteries1: async (req, res) => {
    try {
      const page = parseInt(req.body.page) || 1;
      const limit = 7;
      const skip = (page - 1) * limit;

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today

      // Fetch total count (optional, for frontend pagination)
      const total = await Lottery.countDocuments({ drawDate: { $lt: today } });

      // Fetch paginated past lotteries
      const pastLotteries = await Lottery.find({ drawDate: { $lt: today } })
        .sort({ drawDate: -1 }) // Newest first
        .skip(skip)
        .limit(limit);

      const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const formatted = pastLotteries.map((lottery) => {
        const drawDate = new Date(lottery.drawDate);
        const dayName = weekdays[drawDate.getDay()];
        return { ...lottery._doc, dayName };
      });
      if (formatted.length < 1) {
        return res
          .status(404)
          .json({ success: false, message: "No past lotteries found" });
      }
      return res.json({
        success: true,
        data: {
          page,
          total,
          items: formatted,
        },
      });
    } catch (err) {
      console.error("Error in getPastLotteries:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch past lotteries" });
    }
  },
  getPastLotteries: async (req, res) => {
    try {
      const page = parseInt(req.body.page) || 1; // Default to page 1 if not provided
      const limit = 7;
      const skip = (page - 1) * limit;

      // Get current Bhutan date
      const today = moment().tz("Asia/Dubai").startOf("day");

      // Get all past lotteries (drawDate before today)
      const allPastLotteries = await Lottery.find({
        drawDate: { $lt: today.toDate() },
      })
        .sort({ drawDate: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit);

      // Add weekday name
      const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const items = allPastLotteries.map((lottery) => {
        const drawDate = moment(lottery.drawDate).tz("Asia/Dubai");
        const dayName = weekdays[drawDate.day()];
        return { ...lottery._doc, dayName };
      });

      return res.status(200).json({ success: true, items });
    } catch (err) {
      console.error("Error fetching past lotteries:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "An error occurred while fetching past lotteries.",
        });
    }
  },
  createLottery: async (req, res) => {
    try {
      console.log("Creating lottery with data:", req.body);
      const { name, name2, drawNumber, drawDate, prizes, winners } = req.body;

      // Validate required fields
      if (!name || !drawNumber || !drawDate || !Array.isArray(prizes)) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid input data. Name, drawNumber, drawDate, and prizes are required.",
          });
      }

      // Validate prizes array structure
      for (const prize of prizes) {
        if (!prize.rank || !prize.amount) {
          return res
            .status(400)
            .json({
              success: false,
              message: "Each prize must have rank and amount.",
            });
        }
      }

      // Validate winners array structure if provided
      if (winners && Array.isArray(winners)) {
        for (const winner of winners) {
          if (!winner.resultTime) {
            return res
              .status(400)
              .json({
                success: false,
                message: "Each winner entry must have a resultTime.",
              });
          }
          if (winner.winNumbers && Array.isArray(winner.winNumbers)) {
            for (const winNumber of winner.winNumbers) {
              if (!winNumber.prizeRank || !winNumber.ticketNumber) {
                return res
                  .status(400)
                  .json({
                    success: false,
                    message:
                      "Each winNumber must have prizeRank and ticketNumber.",
                  });
              }
              // Validate ticketNumber is exactly 3 digits
              if (!/^.{1,5}$/.test(winNumber.ticketNumber)) {
                return res
                  .status(400)
                  .json({
                    success: false,
                    message: "Ticket number must have at least one character.",
                  });
              }
            }
          }
        }
      }

      const newLottery = new Lottery({
        name,
        name2: name2 || "", // Make name2 optional with default value
        drawNumber,
        drawDate,
        prizes,
        winners: winners || [], // Use provided winners or initialize as empty array
      });

      const savedLottery = await newLottery.save();
      console.log("\nLottery created successfully:\n", savedLottery);
      return res.status(200).json({
        success: true,
        message: "Lottery created successfully",
        data: savedLottery,
      });
    } catch (err) {
      console.error("Error in createLottery:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to create lottery",
          error: err.message,
        });
    }
  },
  updateLottery1: async (req, res) => {
    try {
      const lotteryId = req.params.id;
      const { name, name2, drawNumber, drawDate, prizes, winners } = req.body;

      if (!lotteryId) {
        return res
          .status(400)
          .json({ success: false, message: "Lottery ID is required" });
      }

      const updateData = {};

      if (name) updateData.name = name;
      if (name2) updateData.name2 = name2;
      if (drawNumber) updateData.drawNumber = drawNumber;
      if (drawDate) updateData.drawDate = drawDate;
      if (prizes) updateData.prizes = prizes;
      if (winners) updateData.winners = winners;

      updateData.updatedAt = new Date();

      const updatedLottery = await Lottery.findByIdAndUpdate(
        lotteryId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedLottery) {
        return res
          .status(404)
          .json({ success: false, message: "Lottery not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Lottery updated successfully",
        data: updatedLottery,
      });
    } catch (err) {
      console.error("Error in updateLottery:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to update lottery" });
    }
  },
  updateLottery: async (req, res) => {
    try {
      const lotteryId = req.params.id;
      const { name, name2, drawNumber, drawDate, prizes, winners } = req.body;

      if (!lotteryId) {
        return res
          .status(400)
          .json({ success: false, message: "Lottery ID is required" });
      }

      // Check if lottery exists
      const existingLottery = await Lottery.findById(lotteryId);
      if (!existingLottery) {
        return res
          .status(404)
          .json({ success: false, message: "Lottery not found" });
      }

      const updateData = {};

      if (name !== undefined) updateData.name = name;
      if (name2 !== undefined) updateData.name2 = name2;
      if (drawNumber !== undefined) updateData.drawNumber = drawNumber;
      if (drawDate !== undefined) updateData.drawDate = drawDate;

      // Validate prizes array structure if provided
      if (prizes !== undefined) {
        if (!Array.isArray(prizes)) {
          return res
            .status(400)
            .json({ success: false, message: "Prizes must be an array." });
        }
        for (const prize of prizes) {
          if (!prize.rank || !prize.amount) {
            return res
              .status(400)
              .json({
                success: false,
                message: "Each prize must have rank and amount.",
              });
          }
        }
        updateData.prizes = prizes;
      }

      // Validate winners array structure if provided
      if (winners !== undefined) {
        if (!Array.isArray(winners)) {
          return res
            .status(400)
            .json({ success: false, message: "Winners must be an array." });
        }
        for (const winner of winners) {
          if (!winner.resultTime) {
            return res
              .status(400)
              .json({
                success: false,
                message: "Each winner entry must have a resultTime.",
              });
          }
          if (winner.winNumbers && Array.isArray(winner.winNumbers)) {
            for (const winNumber of winner.winNumbers) {
              if (!winNumber.prizeRank || !winNumber.ticketNumber) {
                return res
                  .status(400)
                  .json({
                    success: false,
                    message:
                      "Each winNumber must have prizeRank and ticketNumber.",
                  });
              }
              // Validate ticketNumber is exactly 3 digits
              if (!/^.{1,5}$/.test(winNumber.ticketNumber)) {
                return res
                  .status(400)
                  .json({
                    success: false,
                    message: "Ticket number must have at least one character.",
                  });
              }
            }
          }
        }
        updateData.winners = winners;
      }

      updateData.updatedAt = new Date();

      const updatedLottery = await Lottery.findByIdAndUpdate(
        lotteryId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "Lottery updated successfully",
        data: updatedLottery,
      });
    } catch (err) {
      console.error("Error in updateLottery:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to update lottery",
        error: err.message,
      });
    }
  },
  getLottery: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Lottery ID is required" });
      }

      const lottery = await Lottery.findById(id).select(
        "_id name name2 drawNumber drawDate prizes winners"
      );

      if (!lottery) {
        return res
          .status(404)
          .json({ success: false, message: "Lottery not found" });
      }
      console.log("Lottery found:", lottery);
      console.log({
        success: true,
        data: lottery,
      });
      return res.status(200).json({
        success: true,
        data: lottery,
      });
    } catch (err) {
      console.error("Error in getLottery:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch lottery" });
    }
  },
  deleteLottery: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Lottery ID is required" });
      }

      const deletedLottery = await Lottery.findByIdAndDelete(id);

      if (!deletedLottery) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Lottery not found or already deleted",
          });
      }

      return res.status(200).json({
        success: true,
        message: "Lottery deleted successfully",
        // data: deletedLottery
      });
    } catch (err) {
      console.error("Error in deleteLottery:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete lottery" });
    }
  },
  getAllCharges: async (req, res) => {
    try {
      const allCharges = await Charge.find({}).sort({ ticketType: 1 });

      let resObj = {
        success: true,
        message: "Ticket charges retrieved successfully",
        ticketCharges: allCharges || [],
        count: allCharges.length || 0,
      };
      await res.status(200).json(resObj);
    } catch (err) {
      res.status(502).json({
        success: false,
        message: "Failed to retrieve ticket charges",
        error: "Database connection error",
      });
    }
  },
  createCharge: async (req, res) => {
    try {
      const { ticketType, chargeAmount } = req.body;

      // Check for missing required fields
      if (!ticketType || chargeAmount === undefined || chargeAmount === null) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: ticketType, chargeAmount",
        });
      }

      // Create new charge
      const newCharge = new Charge({
        ticketType,
        chargeAmount,
      });

      // Save to database
      const savedCharge = await newCharge.save();

      // Success response
      res.status(201).json({
        success: true,
        message: "Ticket charge created successfully",
        ticketCharge: savedCharge,
      });
    } catch (err) {
      // Handle duplicate ticket type error
      if (err.code === 11000 && err.keyPattern && err.keyPattern.ticketType) {
        return res.status(409).json({
          success: false,
          message: `Ticket type ${req.body.ticketType} already exists`,
          error: "DUPLICATE_TICKET_TYPE",
        });
      }

      // Handle validation errors
      if (err.name === "ValidationError") {
        const errors = {};
        Object.keys(err.errors).forEach((key) => {
          errors[key] = err.errors[key].message;
        });

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors,
        });
      }

      // Handle other database errors
      res.status(502).json({
        success: false,
        message: "Failed to create ticket charge",
        error: "Database connection error",
      });
    }
  },
  updateCharge: async (req, res) => {
    try {
      const { chargeId } = req.params;
      const { ticketType, chargeAmount } = req.body;

      // Check if chargeId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(chargeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ticket charge ID format",
        });
      }

      // Check for missing required fields
      if (chargeAmount === undefined || chargeAmount === null) {
        return res.status(400).json({
          success: false,
          message: "chargeAmount is required",
        });
      }

      // Prepare update object
      const updateData = {};
      if (ticketType !== undefined) updateData.ticketType = ticketType;
      if (chargeAmount !== undefined) updateData.chargeAmount = chargeAmount;

      // Find and update the charge
      const updatedCharge = await Charge.findByIdAndUpdate(
        chargeId,
        updateData,
        { new: true, runValidators: true } // Return updated document and run validators
      );

      // Check if charge was found and updated
      if (!updatedCharge) {
        return res.status(404).json({
          success: false,
          message: "Ticket charge not found",
          error: "CHARGE_NOT_FOUND",
        });
      }

      // Success response
      res.status(200).json({
        success: true,
        message: "Ticket charge updated successfully",
        ticketCharge: updatedCharge,
      });
    } catch (err) {
      console.error("Error in updateCharge:", err);
      // Handle duplicate ticket type error
      if (err.code === 11000 && err.keyPattern && err.keyPattern.ticketType) {
        return res.status(409).json({
          success: false,
          message: `Ticket type ${req.body.ticketType} already exists`,
          error: "DUPLICATE_TICKET_TYPE",
        });
      }

      // Handle validation errors
      if (err.name === "ValidationError") {
        const errors = {};
        Object.keys(err.errors).forEach((key) => {
          errors[key] = err.errors[key].message;
        });

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors,
        });
      }

      // Handle other database errors
      res.status(502).json({
        success: false,
        message: "Failed to update ticket charge",
        error: "Database connection error",
      });
    }
  },
  deleteCharge: async (req, res) => {
    try {
      const { chargeId } = req.params;

      // Check if chargeId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(chargeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ticket charge ID format",
        });
      }

      // Find the charge first to return it in response
      const chargeToDelete = await Charge.findById(chargeId);

      // Check if charge exists
      if (!chargeToDelete) {
        return res.status(404).json({
          success: false,
          message: "Ticket charge not found",
          error: "CHARGE_NOT_FOUND",
        });
      }

      // Attempt to delete the charge
      const deletedCharge = await Charge.findByIdAndDelete(chargeId);

      // Success response
      res.status(200).json({
        success: true,
        message: "Ticket charge deleted successfully",
        "deletedCharge:": {
          _id: chargeToDelete._id,
          ticketType: chargeToDelete.ticketType,
          chargeAmount: chargeToDelete.chargeAmount,
        },
      });
    } catch (err) {
      // Handle constraint violation (if charge is being referenced elsewhere)
      // This would typically require additional logic based on your application's relationships
      if (
        err.code === "CONSTRAINT_VIOLATION" ||
        err.message?.includes("constraint") ||
        err.message?.includes("reference")
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Cannot delete ticket charge. It is currently being used by existing tickets.",
          error: "CHARGE_IN_USE",
        });
      }

      // Handle other database errors
      res.status(502).json({
        success: false,
        message: "Failed to delete ticket charge",
        error: "Database connection error",
      });
    }
  },
  getLotteriesForApi: async (req, res) => {
    try {
      // Extract query parameters for filtering
      const {
        page = 1,
        limit = 10,
        sortBy = "drawDate",
        sortOrder = "desc",
        fromDate,
        toDate,
        search,
      } = req.query;

      // Build filter object
      const filter = {};

      // Date range filtering
      if (fromDate || toDate) {
        filter.drawDate = {};
        if (fromDate) filter.drawDate.$gte = new Date(fromDate);
        if (toDate) filter.drawDate.$lte = new Date(toDate);
      }

      // Search by lottery name
      if (search) {
        filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Fetch lotteries with filtering and pagination
      const lotteries = await Lottery.find(filter)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      // Get total count for pagination info
      const total = await Lottery.countDocuments(filter);

      // Format the response
      const response = {
        success: true,
        lotteries: lotteries.map((lottery) => ({
          _id: lottery._id,
          name: lottery.name,
          name2: lottery.name2,
          drawNumber: lottery.drawNumber,
          drawDate: lottery.drawDate,
          prizes: lottery.prizes.map((prize) => ({
            rank: prize.rank,
            amount: prize.amount,
            _id: prize._id,
          })),
          winners: lottery.winners.map((winner) => ({
            _id: winner._id,
            resultTime: winner.resultTime,
            winNumbers: winner.winNumbers.map((winNumber) => ({
              prizeRank: winNumber.prizeRank,
              ticketNumber: winNumber.ticketNumber,
              resultStatus: winNumber.resultStatus,
              _id: winNumber._id,
            })),
          })),
          createdAt: lottery.createdAt,
          updatedAt: lottery.updatedAt,
          __v: lottery.__v,
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      };

      res.status(200).json(response);
    } catch (err) {
      console.error("Error fetching lotteries:", err);

      res.status(500).json({
        success: false,
        message: "Failed to retrieve lotteries",
        error:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Database connection error",
      });
    }
  },
  getActiveLotteries: async (req, res) => {
    try {
      // Get current Dubai time
      const moment = require('moment-timezone');
      const now = moment().tz('Asia/Dubai');
      const fiveMinutesFromNow = now.clone().add(5, 'minutes');
      const todayStart = now.clone().startOf('day').toDate();
      const todayEnd = now.clone().endOf('day').toDate();
  
      console.log(`Current Dubai time: ${now.format('DD/MM/YYYY HH:mm:ss')}`);
      console.log(`Cut-off time (5 minutes from now): ${fiveMinutesFromNow.format('HH:mm:ss')}`);
  
      // 1. Find parent lotteries where drawDate is today (Dubai date)
      const parentLotteries = await Lottery.find({
        drawDate: {
          $gte: todayStart,
          $lte: todayEnd
        }
      })
      .sort({ drawDate: 1 }) // Sort by drawDate ascending
      .lean();
  
      if (parentLotteries.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No lotteries scheduled for today",
          activeLotteries: [],
          currentLottery: null
        });
      }
  
      console.log(`Found ${parentLotteries.length} parent lotteries for today`);
  
      // 2. Process each parent lottery to find valid child lottery for booking
      const activeLotteries = [];
  
      parentLotteries.forEach(parentLottery => {
        // Skip if no child lotteries (draw times)
        if (!parentLottery.winners || parentLottery.winners.length === 0) {
          console.log(`Skipping ${parentLottery.name} - No draw times available`);
          return; // Don't include parent lottery
        }
  
        console.log(`Processing ${parentLottery.name} with ${parentLottery.winners.length} draw times`);
  
        // 3. Find the next available child lottery for booking
        let availableChild = null;
        let minTimeDiff = Infinity;
  
        parentLottery.winners.forEach((winner, index) => {
          if (!winner.resultTime) {
            console.log(`Skipping draw time ${index + 1} - No result time set`);
            return;
          }
  
          const resultTime = moment(winner.resultTime).tz('Asia/Dubai');
          const timeDiff = resultTime.diff(now); // milliseconds until draw
          
          console.log(`Draw Time ${index + 1}: ${resultTime.format('HH:mm:ss')}, Time until: ${Math.floor(timeDiff / 60000)} minutes`);
  
          // Criteria for valid booking:
          // 1. Draw is in the future (timeDiff > 0)
          // 2. At least 5 minutes away (resultTime > fiveMinutesFromNow)
          // 3. Closest available draw time
          
          if (timeDiff > 0 && resultTime.isAfter(fiveMinutesFromNow) && timeDiff < minTimeDiff) {
            minTimeDiff = timeDiff;
            availableChild = {
              winner,
              index,
              resultTime,
              timeDiff
            };
          }
        });
  
        if (availableChild) {
          // Found a valid draw time for booking
          const drawTimeName = `Draw Time ${availableChild.index + 1}`;
          const drawTimeDisplay = availableChild.resultTime.format('hh:mm A');
          const minutesUntil = Math.floor(availableChild.timeDiff / 60000);
          
          console.log(`✅ Selected ${drawTimeName} at ${drawTimeDisplay} (${minutesUntil} minutes away)`);
          
          activeLotteries.push({
            _id: `${parentLottery._id}_${availableChild.winner._id}`,
            parentId: parentLottery._id,
            name: parentLottery.name,
            name2: parentLottery.name2,
            drawNumber: parentLottery.drawNumber,
            drawDate: parentLottery.drawDate,
            drawTime: drawTimeName,
            drawTimeId: availableChild.winner._id,
            drawTimeDisplay: drawTimeDisplay,
            drawTimeData: availableChild.winner,
            nextDrawTime: availableChild.resultTime.toDate(),
            timeUntilDraw: availableChild.timeDiff,
            minutesUntilDraw: minutesUntil,
            isNext: true,
            isBookable: true,
            parentLottery: parentLottery
          });
        } else {
          console.log(`❌ No bookable draw times found for ${parentLottery.name}`);
          // Don't include this parent lottery
        }
      });
  
      // 4. If no active lotteries found after processing
      if (activeLotteries.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No lotteries available for booking at this time. Next draws are either within 5 minutes or have already started.",
          activeLotteries: [],
          currentLottery: null,
          serverTime: now.format('DD/MM/YYYY hh:mm A'),
          serverTimezone: 'Asia/Dubai'
        });
      }
  
      // 5. Sort active lotteries by nextDrawTime (closest first)
      activeLotteries.sort((a, b) => {
        return new Date(a.nextDrawTime) - new Date(b.nextDrawTime);
      });
  
      // 6. Mark the first one as current/primary
      if (activeLotteries.length > 0) {
        activeLotteries[0].isCurrent = true;
      }
  
      // 7. Also get ticket charges for pricing
      const ticketCharges = await ticketCharge.find()
        .sort({ ticketType: -1 })
        .lean();
  
      // Format ticket charges as a map for easy lookup
      const ticketChargesMap = {};
      ticketCharges.forEach(charge => {
        ticketChargesMap[charge.ticketType] = charge.chargeAmount;
      });
  
      // 8. Prepare response
      const response = {
        success: true,
        message: `${activeLotteries.length} lotteries available for booking`,
        activeLotteries: activeLotteries.map(lottery => ({
          _id: lottery._id,
          parentId: lottery.parentId,
          name: lottery.name,
          name2: lottery.name2,
          drawNumber: lottery.drawNumber,
          drawDate: moment(lottery.drawDate).tz('Asia/Dubai').format('DD/MM/YYYY'),
          drawTime: lottery.drawTime,
          drawTimeId: lottery.drawTimeId,
          drawTimeDisplay: lottery.drawTimeDisplay,
          nextDrawTime: moment(lottery.nextDrawTime).tz('Asia/Dubai').format('DD/MM/YYYY hh:mm A'),
          timeUntilDraw: lottery.timeUntilDraw,
          minutesUntilDraw: lottery.minutesUntilDraw,
          isCurrent: lottery.isCurrent || false,
          isNext: lottery.isNext,
          isBookable: lottery.isBookable,
          prizes: lottery.parentLottery.prizes || [],
          cutoffTime: fiveMinutesFromNow.format('HH:mm:ss'), // When booking closes for this draw
          winner: lottery.drawTimeData ? {
            _id: lottery.drawTimeData._id,
            resultTime: moment(lottery.drawTimeData.resultTime).tz('Asia/Dubai').format('DD/MM/YYYY hh:mm A'),
            winNumbers: lottery.drawTimeData.winNumbers || []
          } : null
        })),
        currentLottery: activeLotteries.length > 0 ? activeLotteries[0] : null,
        ticketCharges: ticketChargesMap,
        serverTime: now.format('DD/MM/YYYY hh:mm A'),
        serverTimezone: 'Asia/Dubai',
        bookingCutoffMinutes: 5,
        nextRefreshTime: moment().add(1, 'minute').tz('Asia/Dubai').format('HH:mm:ss') // Suggest when to check again
      };
  
      console.log(`✅ Returning ${activeLotteries.length} bookable lotteries`);
      res.status(200).json(response);
  
    } catch (err) {
      console.error("Error fetching active lotteries:", err);
  
      res.status(500).json({
        success: false,
        message: "Failed to retrieve lottery information",
        error: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
      });
    }
  },
  getAllTicketCharges: async (req, res) => {
    try{
      let charges = await Charge.find({}).sort({ticketType:1})
      if(!charges){
       return res.status(404).json({success:false, message:"No ticket charges found"})
      }
     return res.status(200).json({success:true, message:"Ticket charges retrieved successfully", ticketCharges: charges, count: charges.length})

     
    }catch(err){
      res.status(500).json({success:false, message:"Failed to retrieve ticket charges", error: err.message})
    }
  },
  saveBooking: async (req, res) => {
    try {
      const { customer, tickets } = req.body;

      // -------------------------
      // Step 1: Validate customer
      // -------------------------
      if (!customer || !customer.name || !customer.phone) {
        return res.status(400).json({
          success: false,
          message: "Customer name and phone are required",
        });
      }

      // -------------------------
      // Step 2: Validate tickets
      // -------------------------
      if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one ticket is required",
        });
      }

      const validatedTickets = [];

      for (const ticket of tickets) {
        if (
          !ticket.lottery ||
          !ticket.lottery.id ||
          !ticket.lottery.timeId ||
          !ticket.number ||
          ticket.type === undefined ||
          ticket.chargeAmount === undefined
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Each ticket must have lottery.id, lottery.timeId, number, type, and chargeAmount",
          });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(ticket.lottery.id)) {
          return res.status(400).json({
            success: false,
            message: `Invalid lottery ID format: ${ticket.lottery.id}`,
          });
        }

        // -------------------------
        // Step 3: Fetch parent lottery
        // -------------------------
        const lottery = await Lottery.findById(ticket.lottery.id);
        if (!lottery) {
          return res.status(404).json({
            success: false,
            message: `Lottery not found with ID: ${ticket.lottery.id}`,
          });
        }

        // -------------------------
        // Step 4: Fetch child lottery (inside winners[])
        // -------------------------
        const timeId =new mongoose.Types.ObjectId(ticket.lottery.timeId);
        const childLottery = lottery.winners.find(
          (w) => w._id.toString() === timeId.toString()
        );

        if (!childLottery) {
          return res.status(404).json({
            success: false,
            message: `Child lottery (winner) not found with ID: ${ticket.lottery.timeId}`,
          });
        }

        // -------------------------
        // Step 5: Push validated ticket into array
        // -------------------------
        validatedTickets.push({
          lottery: {
            id: lottery._id,
            name: lottery.name,
            drawNumber: lottery.drawNumber,
            drawDate: childLottery.resultTime, // ✅ from DB
            timeId: timeId,
          },
          number: ticket.number.toString().trim(),
          type: parseInt(ticket.type),
          chargeAmount: parseFloat(ticket.chargeAmount),
        });
      }

      // -------------------------
      // Step 6: Calculate financials
      // -------------------------
      const quantity = validatedTickets.length;
      const subtotal = validatedTickets.reduce((sum, t) => sum + t.chargeAmount, 0);
      const totalAmount = subtotal; // (add tax/fees here if needed)

      // -------------------------
      // Step 7: Create booking doc
      // -------------------------
      const booking = new Booking({
        ticketNumber: `BOOK-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // unique ref
        customer: {
          name: customer.name.trim(),
          phone: customer.phone.trim(),
        },
        agent: {
          name: req.session.agent.name, // replace with real logged-in agent later
          id: new mongoose.Types.ObjectId(req.session.agent.id), // replace with real agent ID
          phone: "+0000000000",
          role: ["agent"],
        },
        booking: {
          date: new Date(),
          status: "active",
        },
        tickets: validatedTickets, // ✅ always an array
        financial: {
          quantity,
          subtotal,
          totalAmount,
          currency: "USD",
        },
        payment: {
          method: "cash",
          status: "paid",
          reference: `PAY-${Date.now()}`,
        },
      });

      await booking.save();

      return res.status(201).json({
        success: true,
        message: "Booking saved successfully",
        data:booking,
      });
    } catch (err) {
      console.error("Error saving booking:", err);
      res.status(500).json({
        success: false,
        message: "Failed to save booking",
        error: err.message,
      });
    }
  },
  saveBooking1: async (req, res) => {
  try {
    const { customer, tickets } = req.body;

    // ✅ customer validation
    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: "Customer name and phone are required",
      });
    }

    // ✅ tickets validation
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one ticket is required",
      });
    }

    const validatedTickets = [];

    for (const ticket of tickets) {
      if (
        !ticket.lottery ||
        !ticket.lottery.id ||
        !ticket.lottery.timeId ||
        !ticket.number ||
        ticket.type === undefined ||
        ticket.chargeAmount === undefined
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each ticket must have lottery.id, lottery.timeId, number, type, and chargeAmount",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(ticket.lottery.id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid lottery ID format: ${ticket.lottery.id}`,
        });
      }

      const lottery = await Lottery.findById(ticket.lottery.id);
      if (!lottery) {
        return res.status(404).json({
          success: false,
          message: `Lottery not found with ID: ${ticket.lottery.id}`,
        });
      }

      const timeId =new mongoose.Types.ObjectId(ticket.lottery.timeId);
      const childLottery = lottery.winners.find(
        (w) => w._id.toString() === timeId.toString()
      );

      if (!childLottery) {
        return res.status(404).json({
          success: false,
          message: `Child lottery not found with ID: ${ticket.lottery.timeId}`,
        });
      }

      validatedTickets.push({
        lottery: {
          id: lottery._id,
          name: lottery.name,
          drawNumber: lottery.drawNumber,
          drawDate: childLottery.resultTime,
          timeId: timeId,
        },
        number: ticket.number.toString().trim(),
        type: parseInt(ticket.type),
        chargeAmount: parseFloat(ticket.chargeAmount),
      });
    }

    const quantity = validatedTickets.length;
    const subtotal = validatedTickets.reduce((s, t) => s + t.chargeAmount, 0);
    const totalAmount = subtotal;

    const booking = new Booking({
      ticketNumber: `BOOK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
      },
      agent: {
        name: "System Agent",
        id: new mongoose.Types.ObjectId(),
        phone: "+0000000000",
        role: ["agent"],
      },
      booking: { date: new Date(), status: "active" },
      tickets: validatedTickets,
      financial: { quantity, subtotal, totalAmount, currency: "USD" },
      payment: {
        method: "cash",
        status: "paid",
        reference: `PAY-${Date.now()}`,
      },
    });

    await booking.save();

    // -------------------------
    // 📄 Generate PDF Receipt
    // -------------------------
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${booking.ticketNumber}.pdf`
    );

    // Pipe PDF directly to response
    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Lottery Booking Receipt", { align: "center" });
    doc.moveDown();

    // Booking Info
    doc.fontSize(12).text(`Booking Ref: ${booking.ticketNumber}`);
    doc.text(`Date: ${booking.booking.date.toDateString()}`);
    doc.moveDown();

    // Customer Info
    doc.text(`Customer: ${booking.customer.name}`);
    doc.text(`Phone: ${booking.customer.phone}`);
    doc.moveDown();

    // Ticket Table
    doc.fontSize(14).text("Tickets:", { underline: true });
    doc.moveDown(0.5);

    booking.tickets.forEach((t, i) => {
      doc
        .fontSize(12)
        .text(
          `${i + 1}. ${t.lottery.name} | Draw #${t.lottery.drawNumber} | ${new Date(
            t.lottery.drawDate
          ).toDateString()} | Number: ${t.number} | Type: ${t.type} | $${t.chargeAmount.toFixed(
            2
          )}`
        );
    });
    doc.moveDown();

    // Financials
    doc.fontSize(14).text("Payment Summary:", { underline: true });
    doc.fontSize(12).text(`Quantity: ${booking.financial.quantity}`);
    doc.text(`Subtotal: $${booking.financial.subtotal.toFixed(2)}`);
    doc.text(`Total: $${booking.financial.totalAmount.toFixed(2)}`);
    doc.text(`Payment Status: ${booking.payment.status}`);
    doc.text(`Payment Ref: ${booking.payment.reference}`);

    doc.end(); // 🚀 sends the PDF stream

  } catch (err) {
    console.error("Error saving booking:", err);
    res.status(500).json({
      success: false,
      message: "Failed to save booking",
      error: err.message,
    });
  }
},
};
module.exports = indexHelper;
