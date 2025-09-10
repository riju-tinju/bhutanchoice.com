const Lottery = require('../model/lotterySchema'); // Your model
const moment = require('moment-timezone');

const indexHelper = {
  getLotteries: async (req, res) => {
    try {
      const allLotteries = await Lottery.find({});

      // Get Dubai's current date (00:00:00 of today)
      const today = moment().tz("Asia/Dubai").startOf('day');
      console.log("Today's date in Bhutan timezone:", today.toDate());
      const tomorrow = moment(today).add(1, 'day');

      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const todays = [];
      const upcoming = [];
      const past = [];

      allLotteries.forEach(lottery => {
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

      return res.render('index', {
        todays,
        upcoming: filteredUpcoming,
        past: limitedPast,
        currentDateFromServer: today.toDate(),
      });

    } catch (err) {
      console.error("Error fetching lotteries:", err);
      return res.status(500).json({ success: false, message: 'An error occurred while fetching lotteries.' });
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

      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      const formatted = pastLotteries.map(lottery => {
        const drawDate = new Date(lottery.drawDate);
        const dayName = weekdays[drawDate.getDay()];
        return { ...lottery._doc, dayName };
      });
      if (formatted.length < 1) {
        return res.status(404).json({ success: false, message: 'No past lotteries found' });
      }
      return res.json({
        success: true,
        data: {
          page,
          total,
          items: formatted
        }
      });

    } catch (err) {
      console.error("Error in getPastLotteries:", err);
      return res.status(500).json({ success: false, message: 'Failed to fetch past lotteries' });
    }
  },
  getPastLotteries: async (req, res) => {
    try {
      const page = parseInt(req.body.page) || 1; // Default to page 1 if not provided
      const limit = 7;
      const skip = (page - 1) * limit;

      // Get current Bhutan date
      const today = moment().tz("Asia/Dubai").startOf('day');

      // Get all past lotteries (drawDate before today)
      const allPastLotteries = await Lottery.find({
        drawDate: { $lt: today.toDate() }
      }).sort({ drawDate: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit);

      // Add weekday name
      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const items = allPastLotteries.map(lottery => {
        const drawDate = moment(lottery.drawDate).tz("Asia/Dubai");
        const dayName = weekdays[drawDate.day()];
        return { ...lottery._doc, dayName };
      });

      return res.status(200).json({ success: true, items });
    } catch (err) {
      console.error("Error fetching past lotteries:", err);
      return res.status(500).json({ success: false, message: 'An error occurred while fetching past lotteries.' });
    }
  },
  createLottery: async (req, res) => {
    try {
      console.log("Creating lottery with data:", req.body);
      const { name, name2, drawNumber, drawDate, prizes, winners } = req.body;

      // Validate required fields
      if (!name || !drawNumber || !drawDate || !Array.isArray(prizes)) {
        return res.status(400).json({ success: false, message: 'Invalid input data. Name, drawNumber, drawDate, and prizes are required.' });
      }

      // Validate prizes array structure
      for (const prize of prizes) {
        if (!prize.rank || !prize.amount) {
          return res.status(400).json({ success: false, message: 'Each prize must have rank and amount.' });
        }
      }

      // Validate winners array structure if provided
      if (winners && Array.isArray(winners)) {
        for (const winner of winners) {
          if (!winner.resultTime) {
            return res.status(400).json({ success: false, message: 'Each winner entry must have a resultTime.' });
          }
          if (winner.winNumbers && Array.isArray(winner.winNumbers)) {
            for (const winNumber of winner.winNumbers) {
              if (!winNumber.prizeRank || !winNumber.ticketNumber) {
                return res.status(400).json({ success: false, message: 'Each winNumber must have prizeRank and ticketNumber.' });
              }
              // Validate ticketNumber is exactly 3 digits
              if (!/^.{1,5}$/.test(winNumber.ticketNumber)) {
                return res.status(400).json({ success: false, message: 'Ticket number must have at least one character.' });
              }
            }
          }
        }
      }

      const newLottery = new Lottery({
        name,
        name2: name2 || '', // Make name2 optional with default value
        drawNumber,
        drawDate,
        prizes,
        winners: winners || [] // Use provided winners or initialize as empty array
      });

      const savedLottery = await newLottery.save();
      console.log("\nLottery created successfully:\n", savedLottery);
      return res.status(200).json({
        success: true,
        message: 'Lottery created successfully',
        data: savedLottery
      });
    } catch (err) {
      console.error("Error in createLottery:", err);
      return res.status(500).json({ success: false, message: 'Failed to create lottery', error: err.message });
    }
  },
  updateLottery1: async (req, res) => {
    try {
      const lotteryId = req.params.id;
      const { name, name2, drawNumber, drawDate, prizes, winners } = req.body;

      if (!lotteryId) {
        return res.status(400).json({ success: false, message: 'Lottery ID is required' });
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
        return res.status(404).json({ success: false, message: 'Lottery not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Lottery updated successfully',
        data: updatedLottery
      });

    } catch (err) {
      console.error("Error in updateLottery:", err);
      return res.status(500).json({ success: false, message: 'Failed to update lottery' });
    }
  },
  updateLottery: async (req, res) => {
    try {
      const lotteryId = req.params.id;
      const { name, name2, drawNumber, drawDate, prizes, winners } = req.body;

      if (!lotteryId) {
        return res.status(400).json({ success: false, message: 'Lottery ID is required' });
      }

      // Check if lottery exists
      const existingLottery = await Lottery.findById(lotteryId);
      if (!existingLottery) {
        return res.status(404).json({ success: false, message: 'Lottery not found' });
      }

      const updateData = {};

      if (name !== undefined) updateData.name = name;
      if (name2 !== undefined) updateData.name2 = name2;
      if (drawNumber !== undefined) updateData.drawNumber = drawNumber;
      if (drawDate !== undefined) updateData.drawDate = drawDate;

      // Validate prizes array structure if provided
      if (prizes !== undefined) {
        if (!Array.isArray(prizes)) {
          return res.status(400).json({ success: false, message: 'Prizes must be an array.' });
        }
        for (const prize of prizes) {
          if (!prize.rank || !prize.amount) {
            return res.status(400).json({ success: false, message: 'Each prize must have rank and amount.' });
          }
        }
        updateData.prizes = prizes;
      }

      // Validate winners array structure if provided
      if (winners !== undefined) {
        if (!Array.isArray(winners)) {
          return res.status(400).json({ success: false, message: 'Winners must be an array.' });
        }
        for (const winner of winners) {
          if (!winner.resultTime) {
            return res.status(400).json({ success: false, message: 'Each winner entry must have a resultTime.' });
          }
          if (winner.winNumbers && Array.isArray(winner.winNumbers)) {
            for (const winNumber of winner.winNumbers) {
              if (!winNumber.prizeRank || !winNumber.ticketNumber) {
                return res.status(400).json({ success: false, message: 'Each winNumber must have prizeRank and ticketNumber.' });
              }
              // Validate ticketNumber is exactly 3 digits
              if (!/^.{1,5}$/.test(winNumber.ticketNumber)) {
                return res.status(400).json({ success: false, message: 'Ticket number must have at least one character.' });
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
        message: 'Lottery updated successfully',
        data: updatedLottery
      });

    } catch (err) {
      console.error("Error in updateLottery:", err);
      return res.status(500).json({
        success: false,
        message: 'Failed to update lottery',
        error: err.message
      });
    }
  },
  getLottery: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Lottery ID is required' });
      }

      const lottery = await Lottery.findById(id).select('_id name name2 drawNumber drawDate prizes winners');

      if (!lottery) {
        return res.status(404).json({ success: false, message: 'Lottery not found' });
      }
      console.log("Lottery found:", lottery);
      console.log({
        success: true,
        data: lottery
      })
      return res.status(200).json({
        success: true,
        data: lottery,
      });

    } catch (err) {
      console.error("Error in getLottery:", err);
      return res.status(500).json({ success: false, message: 'Failed to fetch lottery' });
    }
  },
  deleteLottery: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Lottery ID is required' });
      }

      const deletedLottery = await Lottery.findByIdAndDelete(id);

      if (!deletedLottery) {
        return res.status(404).json({ success: false, message: 'Lottery not found or already deleted' });
      }

      return res.status(200).json({
        success: true,
        message: 'Lottery deleted successfully',
        // data: deletedLottery
      });

    } catch (err) {
      console.error("Error in deleteLottery:", err);
      return res.status(500).json({ success: false, message: 'Failed to delete lottery' });
    }
  },


}
module.exports = indexHelper